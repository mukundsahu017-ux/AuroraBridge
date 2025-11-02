use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, UnorderedSet};
use near_sdk::{env, near_bindgen, AccountId, Balance, PanicOnDefault, Promise};
use near_sdk::serde::{Deserialize, Serialize};

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Guardian {
    pub pubkey: [u8; 32],
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct NearBridge {
    /// Contract owner
    pub owner: AccountId,
    
    /// Authorized guardian public keys
    pub guardians: Vec<Guardian>,
    
    /// Required signature quorum
    pub quorum: u32,
    
    /// Processed VAA nonces (replay protection)
    pub processed_vaas: UnorderedSet<u64>,
    
    /// Wrapped token balances (asset_id -> account -> balance)
    pub wrapped_balances: UnorderedMap<String, UnorderedMap<AccountId, Balance>>,
    
    /// Total supply per wrapped asset
    pub wrapped_supply: UnorderedMap<String, Balance>,
}

#[near_bindgen]
impl NearBridge {
    #[init]
    pub fn new(owner: AccountId, guardians: Vec<[u8; 32]>, quorum: u32) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        assert!(quorum > 0 && quorum <= guardians.len() as u32, "Invalid quorum");

        let guardian_list: Vec<Guardian> = guardians
            .iter()
            .map(|pk| Guardian { pubkey: *pk })
            .collect();

        Self {
            owner,
            guardians: guardian_list,
            quorum,
            processed_vaas: UnorderedSet::new(b"p".to_vec()),
            wrapped_balances: UnorderedMap::new(b"b".to_vec()),
            wrapped_supply: UnorderedMap::new(b"s".to_vec()),
        }
    }

    /// Mint wrapped tokens based on verified VAA from source chain
    /// 
    /// # Arguments
    /// * `vaa_json` - JSON-serialized VAA with guardian signatures
    pub fn mint_wrapped(&mut self, vaa_json: String) {
        // Parse VAA
        // In production: deserialize from JSON, verify structure
        // let vaa: VAA = serde_json::from_str(&vaa_json).expect("Invalid VAA");
        
        // TODO: Implement full VAA verification
        // 1. Compute digest from VAA fields
        // 2. Verify guardian signatures against digest
        // 3. Check quorum is met
        // 4. Verify destination_chain == NEAR and destination_contract == this contract
        
        // Placeholder values (replace with actual parsing)
        let vaa_nonce = 1u64;
        let asset_id = "stellar_asset_123".to_string();
        let recipient = env::predecessor_account_id();
        let amount: Balance = 1000;

        // Replay protection
        assert!(
            !self.processed_vaas.contains(&vaa_nonce),
            "VAA already processed"
        );
        self.processed_vaas.insert(&vaa_nonce);

        // Mint wrapped tokens
        let mut balances = self
            .wrapped_balances
            .get(&asset_id)
            .unwrap_or_else(|| UnorderedMap::new(format!("b:{}", asset_id).as_bytes().to_vec()));

        let current_balance = balances.get(&recipient).unwrap_or(0);
        balances.insert(&recipient, &(current_balance + amount));
        self.wrapped_balances.insert(&asset_id, &balances);

        // Update total supply
        let current_supply = self.wrapped_supply.get(&asset_id).unwrap_or(0);
        self.wrapped_supply
            .insert(&asset_id, &(current_supply + amount));

        // Emit event
        env::log_str(&format!(
            "Minted {} of {} to {}",
            amount, asset_id, recipient
        ));
    }

    /// Burn wrapped tokens to unlock on source chain
    /// 
    /// # Arguments
    /// * `asset_id` - Wrapped asset identifier
    /// * `amount` - Amount to burn
    /// * `recipient_chain` - Destination chain (1 = Stellar)
    /// * `recipient` - Recipient address on destination chain (hex string)
    pub fn burn_wrapped(
        &mut self,
        asset_id: String,
        amount: Balance,
        recipient_chain: u8,
        recipient: String,
    ) {
        let sender = env::predecessor_account_id();

        // Get sender's balance
        let mut balances = self
            .wrapped_balances
            .get(&asset_id)
            .expect("Asset not found");

        let current_balance = balances.get(&sender).expect("Insufficient balance");
        assert!(current_balance >= amount, "Insufficient balance");

        // Burn tokens
        balances.insert(&sender, &(current_balance - amount));
        self.wrapped_balances.insert(&asset_id, &balances);

        // Update supply
        let current_supply = self.wrapped_supply.get(&asset_id).unwrap_or(0);
        self.wrapped_supply
            .insert(&asset_id, &(current_supply - amount));

        // Emit burn event (relayer will observe this and create VAA for destination chain)
        env::log_str(&format!(
            "Burned {} of {} from {} to chain {} recipient {}",
            amount, asset_id, sender, recipient_chain, recipient
        ));
    }

    /// Get wrapped token balance
    pub fn balance_of(&self, asset_id: String, account: AccountId) -> Balance {
        self.wrapped_balances
            .get(&asset_id)
            .and_then(|balances| balances.get(&account))
            .unwrap_or(0)
    }

    /// Get total supply of wrapped asset
    pub fn total_supply(&self, asset_id: String) -> Balance {
        self.wrapped_supply.get(&asset_id).unwrap_or(0)
    }

    /// Check if VAA has been processed
    pub fn is_vaa_processed(&self, nonce: u64) -> bool {
        self.processed_vaas.contains(&nonce)
    }

    /// Update guardians (owner only)
    pub fn update_guardians(&mut self, new_guardians: Vec<[u8; 32]>, new_quorum: u32) {
        assert_eq!(
            env::predecessor_account_id(),
            self.owner,
            "Only owner can update guardians"
        );
        assert!(
            new_quorum > 0 && new_quorum <= new_guardians.len() as u32,
            "Invalid quorum"
        );

        self.guardians = new_guardians
            .iter()
            .map(|pk| Guardian { pubkey: *pk })
            .collect();
        self.quorum = new_quorum;
    }

    /// Get guardians list (view only)
    pub fn get_guardians(&self) -> Vec<[u8; 32]> {
        self.guardians.iter().map(|g| g.pubkey).collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::{testing_env, VMContext};

    fn get_context(predecessor: AccountId) -> VMContext {
        VMContextBuilder::new()
            .predecessor_account_id(predecessor)
            .build()
    }

    #[test]
    fn test_initialization() {
        let context = get_context("owner.near".parse().unwrap());
        testing_env!(context);

        let guardians = vec![[1u8; 32], [2u8; 32]];
        let contract = NearBridge::new("owner.near".parse().unwrap(), guardians, 2);

        assert_eq!(contract.guardians.len(), 2);
        assert_eq!(contract.quorum, 2);
    }

    #[test]
    fn test_balance_of() {
        let context = get_context("owner.near".parse().unwrap());
        testing_env!(context);

        let contract = NearBridge::new(
            "owner.near".parse().unwrap(),
            vec![[1u8; 32]],
            1,
        );

        let balance = contract.balance_of(
            "test_asset".to_string(),
            "user.near".parse().unwrap(),
        );
        assert_eq!(balance, 0);
    }
}
