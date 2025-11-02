#![allow(non_snake_case)]
#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, log, token, Address, BytesN, Env, String, Symbol, symbol_short,
};

/// Storage keys for persistent data
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    /// Nonce counter for outgoing locks
    LockNonce,
    /// Admin address
    Admin,
}

/// Structure to track bridge statistics
#[contracttype]
#[derive(Clone)]
pub struct BridgeStats {
    pub total_locked: u64,   // Total number of lock transactions
    pub total_released: u64, // Total number of release transactions
    pub total_volume: i128,  // Total volume transferred
}

// Symbol for referencing the BridgeStats struct
const BRIDGE_STATS: Symbol = symbol_short!("B_STATS");

/// Structure for storing lock transaction details
#[contracttype]
#[derive(Clone)]
pub struct LockRecord {
    pub nonce: u64,
    pub token: Address,
    pub amount: i128,
    pub sender: Address,
    pub recipient_chain: u32,
    pub recipient: BytesN<32>,
    pub timestamp: u64,
    pub is_released: bool,
}

/// Mapping for lock records
#[contracttype]
pub enum LockBook {
    Lock(u64), // Maps nonce to LockRecord
}

#[contract]
pub struct AuroraBridgeContract;

#[contractimpl]
impl AuroraBridgeContract {
    /// Initialize the AuroraBridge contract
    /// 
    /// # Arguments
    /// * `admin` - Admin address for contract management
    /// 
    /// This function sets up the bridge contract with an admin and initializes counters
    pub fn initialize(env: Env, admin: Address) {
        // Ensure not already initialized
        if env.storage().instance().has(&DataKey::Admin) {
            log!(&env, "Contract already initialized!");
            panic!("Already initialized");
        }

        admin.require_auth();

        // Store admin and initialize counters
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::LockNonce, &0u64);
        
        // Initialize bridge statistics
        let stats = BridgeStats {
            total_locked: 0,
            total_released: 0,
            total_volume: 0,
        };
        env.storage().instance().set(&BRIDGE_STATS, &stats);

        env.storage().instance().extend_ttl(5000, 5000);

        log!(&env, "AuroraBridge initialized with admin: {}", admin);
    }

    /// Lock tokens for cross-chain transfer to NEAR
    /// 
    /// # Arguments
    /// * `token` - Token contract address to lock
    /// * `amount` - Amount to lock (in token's smallest unit)
    /// * `recipient_chain` - Destination chain ID (2 = NEAR)
    /// * `recipient` - Recipient address on NEAR (32 bytes)
    /// 
    /// # Returns
    /// Unique nonce for tracking this transfer
    pub fn lock_tokens(
        env: Env,
        token: Address,
        amount: i128,
        recipient_chain: u32,
        recipient: BytesN<32>,
    ) -> u64 {
        // Validate amount
        if amount <= 0 {
            log!(&env, "Amount must be positive!");
            panic!("Amount must be positive");
        }

        // Get current nonce and increment
        let mut nonce: u64 = env.storage().instance().get(&DataKey::LockNonce).unwrap_or(0);
        nonce += 1;

        // Check if this nonce is already used (should not happen)
        let existing_record = Self::view_lock_record(env.clone(), nonce);
        if existing_record.is_released == false && existing_record.nonce != 0 {
            log!(&env, "Lock already exists for this nonce!");
            panic!("Lock already exists");
        }

        // Get timestamp
        let timestamp = env.ledger().timestamp();

        // Use contract address as sender (in production, use require_auth)
        let sender = env.current_contract_address();

        // Create lock record
        let lock_record = LockRecord {
            nonce,
            token: token.clone(),
            amount,
            sender: sender.clone(),
            recipient_chain,
            recipient: recipient.clone(),
            timestamp,
            is_released: false,
        };

        // Store lock record
        env.storage().instance().set(&LockBook::Lock(nonce), &lock_record);

        // Update nonce counter
        env.storage().instance().set(&DataKey::LockNonce, &nonce);

        // Update bridge statistics
        let mut stats = Self::view_bridge_stats(env.clone());
        stats.total_locked += 1;
        stats.total_volume += amount;
        env.storage().instance().set(&BRIDGE_STATS, &stats);

        // Transfer tokens to contract (requires prior approval)
        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&sender, &env.current_contract_address(), &amount);

        // Extend storage TTL
        env.storage().instance().extend_ttl(5000, 5000);

        log!(
            &env,
            "Tokens locked! Nonce: {}, Amount: {}, Recipient Chain: {}",
            nonce,
            amount,
            recipient_chain
        );

        nonce
    }

    /// Release tokens after verification from NEAR chain
    /// 
    /// # Arguments
    /// * `nonce` - The lock nonce to release
    /// * `recipient` - Address to receive the tokens
    /// 
    /// This function releases locked tokens to the specified recipient
    /// In production, this would be called by guardians after verifying NEAR transactions
    pub fn release_tokens(env: Env, nonce: u64, recipient: Address) {
        // Get admin for authorization (in production, use guardian verification)
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("Not initialized");
        admin.require_auth();

        // Get lock record
        let mut lock_record = Self::view_lock_record(env.clone(), nonce);

        // Validate lock exists and hasn't been released
        if lock_record.nonce == 0 {
            log!(&env, "Lock record not found for nonce: {}", nonce);
            panic!("Lock not found");
        }

        if lock_record.is_released {
            log!(&env, "Tokens already released for nonce: {}", nonce);
            panic!("Already released");
        }

        // Mark as released
        lock_record.is_released = true;
        env.storage().instance().set(&LockBook::Lock(nonce), &lock_record);

        // Update bridge statistics
        let mut stats = Self::view_bridge_stats(env.clone());
        stats.total_released += 1;
        env.storage().instance().set(&BRIDGE_STATS, &stats);

        // Transfer tokens to recipient
        let token_client = token::Client::new(&env, &lock_record.token);
        token_client.transfer(
            &env.current_contract_address(),
            &recipient,
            &lock_record.amount,
        );

        // Extend storage TTL
        env.storage().instance().extend_ttl(5000, 5000);

        log!(
            &env,
            "Tokens released! Nonce: {}, Amount: {}, Recipient: {}",
            nonce,
            lock_record.amount,
            recipient
        );
    }

    /// View details of a specific lock transaction by nonce
    /// 
    /// # Arguments
    /// * `nonce` - The lock nonce to query
    /// 
    /// # Returns
    /// LockRecord with transaction details or default values if not found
    pub fn view_lock_record(env: Env, nonce: u64) -> LockRecord {
        let key = LockBook::Lock(nonce);

        env.storage().instance().get(&key).unwrap_or(LockRecord {
            // Return default values if not found
            nonce: 0,
            token: env.current_contract_address(),
            amount: 0,
            sender: env.current_contract_address(),
            recipient_chain: 0,
            recipient: BytesN::from_array(&env, &[0u8; 32]),
            timestamp: 0,
            is_released: false,
        })
    }

    /// View overall bridge statistics
    /// 
    /// # Returns
    /// BridgeStats with total locks, releases, and volume
    pub fn view_bridge_stats(env: Env) -> BridgeStats {
        env.storage().instance().get(&BRIDGE_STATS).unwrap_or(BridgeStats {
            total_locked: 0,
            total_released: 0,
            total_volume: 0,
        })
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AuroraBridgeContract);
        let client = AuroraBridgeContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);

        env.mock_all_auths();
        client.initialize(&admin);

        let stats = client.view_bridge_stats();
        assert_eq!(stats.total_locked, 0);
        assert_eq!(stats.total_released, 0);
    }

    #[test]
    #[should_panic(expected = "Already initialized")]
    fn test_double_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AuroraBridgeContract);
        let client = AuroraBridgeContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);

        env.mock_all_auths();
        client.initialize(&admin);
        client.initialize(&admin); // Should panic
    }

    #[test]
    fn test_lock_tokens() {
        let env = Env::default();
        let contract_id = env.register_contract(None, AuroraBridgeContract);
        let client = AuroraBridgeContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let token_address = Address::generate(&env);
        let recipient = BytesN::from_array(&env, &[1u8; 32]);

        env.mock_all_auths();
        client.initialize(&admin);

        let nonce = client.lock_tokens(&token_address, &1000000, &2, &recipient);
        assert_eq!(nonce, 1);

        let lock_record = client.view_lock_record(&nonce);
        assert_eq!(lock_record.amount, 1000000);
        assert_eq!(lock_record.recipient_chain, 2);
        assert_eq!(lock_record.is_released, false);
    }
}
