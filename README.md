# AuroraBridge# Stellar ↔ NEAR Cross-Chain Bridge



A decentralized, Rust-powered cross-chain bridge protocol enabling secure token transfers between Stellar's Soroban and NEAR blockchain.# 🌉 Stellar ↔ NEAR Cross-Chain Bridge



![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)A production-ready, fully-featured cross-chain bridge protocol enabling secure token transfers between Stellar and NEAR networks with a modern Next.js frontend.

![Rust](https://img.shields.io/badge/rust-1.70+-orange.svg)

![Stellar](https://img.shields.io/badge/stellar-soroban-purple.svg)![License](https://img.shields.io/badge/license-MIT-blue.svg)

![NEAR](https://img.shields.io/badge/NEAR-protocol-green.svg)![Rust](https://img.shields.io/badge/rust-2024-orange.svg)

![Next.js](https://img.shields.io/badge/next.js-14.2-black.svg)

---![Stellar](https://img.shields.io/badge/stellar-soroban-purple.svg)



## 📋 Table of Contents## 🏗️ Architecture



- [Project Description](#-project-description)This bridge uses the **Relayer + Guardian Multi-Sig** pattern (similar to Wormhole):

- [Project Vision](#-project-vision)

- [Key Features](#-key-features)1. **Soroban Contract (Stellar)** - Locks/releases assets on Stellar

- [Future Scope](#-future-scope)2. **NEAR Contract** - Mints/burns wrapped tokens on NEAR

- [Smart Contract Architecture](#%EF%B8%8F-smart-contract-architecture)3. **Relayer Service** - Monitors both chains and creates signed cross-chain messages (VAAs)

- [Deployment Information](#-deployment-information)4. **Shared Library** - Common message format and cryptographic verification

- [Getting Started](#-getting-started)

- [Contract Functions](#-contract-functions)## 📁 Project Structure

- [Technical Stack](#%EF%B8%8F-technical-stack)

- [License](#-license)```

stellar-bridge/

---├── contracts/

│   ├── soroban-bridge/    # Stellar Soroban contract (Rust)

## 📖 Project Description│   └── near-bridge/       # NEAR contract (Rust)

├── relayer/               # Off-chain relayer service (Rust)

**AuroraBridge** is a decentralized, Rust-powered cross-chain bridge protocol that enables secure, verifiable, and transparent token transfers between Stellar's Soroban smart contract platform and the NEAR blockchain.├── shared/                # Shared VAA format and crypto

├── scripts/               # Deployment scripts

By leveraging Rust-based smart contracts on both chains and a trust-minimized relayer network, AuroraBridge provides a seamless way for assets to move across blockchain ecosystems while maintaining their total supply and integrity. The system focuses on interoperability, security, and scalability, bringing the vision of a unified Web3 ecosystem closer to reality.└── README.md

```

### Core Components

## 🚀 Quick Start

- 🌟 **Soroban Bridge Contract** (Stellar): Handles token locking and release operations on Stellar

- 🔷 **NEAR Bridge Contract**: Manages corresponding operations on NEAR Protocol  ### Prerequisites

- 🔗 **Relayer Network**: Trust-minimized validator network for cross-chain message verification

- 🎨 **Frontend dApp**: User-friendly interface built with Next.js for seamless bridge operations1. **Rust toolchain** (1.70+)

   ```powershell

---   # Install from https://rustup.rs

   rustup target add wasm32-unknown-unknown

## 🎯 Project Vision   ```



AuroraBridge envisions a **unified Web3 ecosystem** where assets flow freely between blockchain networks without compromising security or decentralization. Our mission is to:2. **Soroban CLI**

   ```powershell

1. **Break Down Silos**: Enable seamless interoperability between Stellar and NEAR ecosystems   cargo install --locked soroban-cli

2. **Maintain Security**: Implement guardian-based verification with multi-signature requirements   ```

3. **Preserve Decentralization**: Use trust-minimized relayer networks instead of centralized bridges

4. **Ensure Transparency**: All cross-chain operations are verifiable on-chain3. **NEAR CLI**

5. **Scale Efficiently**: Design for high throughput and low transaction costs   ```powershell

   npm install -g near-cli

### Long-term Vision   ```



- Become the primary bridge infrastructure connecting Stellar and NEAR### Build All Components

- Expand to support multiple token types and NFTs

- Integrate with DeFi protocols for cross-chain liquidity```powershell

- Enable cross-chain smart contract calls (not just token transfers)# From project root

cargo build --release --target wasm32-unknown-unknown

---```



## ✨ Key Features### Deploy Contracts



### 🔐 Security First#### 1. Deploy Soroban Contract (Stellar Testnet)



- **Multi-Guardian Verification**: Requires multiple guardian signatures (configurable quorum)```powershell

- **Replay Protection**: VAA (Verifiable Action Approval) nonces prevent duplicate processing.\scripts\deploy-soroban.ps1

- **Admin Controls**: Secure initialization and guardian management```

- **Auditable Events**: All lock/release operations emit verifiable events

Then follow the printed instructions to:

### 🌉 Cross-Chain Operations- Configure network and identity

- Deploy the WASM

- **Token Locking**: Lock assets on source chain with recipient details- Initialize with guardian public keys

- **Verified Release**: Release tokens on destination chain after guardian approval

- **Nonce Tracking**: Unique identifiers for each cross-chain transfer#### 2. Deploy NEAR Contract (NEAR Testnet)

- **Status Queries**: Real-time verification of processed transfers

```powershell

### ⚡ Performance.\scripts\deploy-near.ps1

```

- **Optimized WASM**: Contract size reduced from 21KB to 11KB

- **Gas Efficient**: Minimal on-chain storage with efficient data structuresFollow instructions to:

- **Fast Finality**: Leverages Stellar's 5-second block time- Create contract account

- Deploy WASM

### 🎨 User Experience- Initialize with guardians



- **Freighter Wallet Integration**: Native Stellar wallet support via official API### Run Relayer

- **Real-time Updates**: Live transaction status and confirmations

- **Testnet Support**: Full testing environment before mainnet deployment1. **Generate Guardian Keys**

- **Transaction Explorer**: Direct links to Stellar Expert for verification

```powershell

---# Using ed25519-dalek or any ed25519 tool

# Example with OpenSSL (if available):

## 🚀 Future Scope# openssl genpkey -algorithm ed25519 -out guardian.pem

# Or use a Rust script to generate and print hex

### Phase 1: Enhanced Token Support (Q1 2026)```

- Support for custom Stellar tokens (SEP-41 standard)

- Multi-asset bridge pools2. **Configure Environment**

- Wrapped token creation on NEAR

```powershell

### Phase 2: Advanced Features (Q2 2026)cp .env.example .env

- **Cross-chain NFT Transfers**: Bridge non-fungible tokens between chains# Edit .env with your contract addresses and guardian key

- **Atomic Swaps**: Direct asset exchanges without intermediaries```

- **Liquidity Pools**: Earn fees by providing bridge liquidity

- **Flash Loans**: Cross-chain flash loan functionality3. **Start Relayer**



### Phase 3: Protocol Expansion (Q3 2026)```powershell

- **Additional Chain Support**: Expand beyond Stellar and NEARcd relayer

  - Ethereum/EVM chainscargo run --release

  - Cosmos ecosystem```

  - Polkadot parachains

- **Cross-chain Messaging**: Enable smart contract interactions across chainsThe relayer will:

- **DAO Governance**: Community-controlled bridge parameters and upgrades- Monitor Stellar for `lock` events

- Monitor NEAR for `burn` events  

### Phase 4: Enterprise Integration (Q4 2026)- Create signed VAAs

- **B2B APIs**: RESTful APIs for enterprise integration- Submit VAAs to destination chain

- **Batch Transfers**: Bulk cross-chain operations

- **Compliance Module**: KYC/AML integration options## 🔒 Security Features

- **Analytics Dashboard**: Comprehensive bridge metrics and insights

### Implemented

### Technical Roadmap

- ✅ **Multi-signature verification** - Supports multiple guardians with configurable quorum

- [ ] Zero-knowledge proof integration for enhanced privacy- ✅ **Replay protection** - Nonce-based tracking prevents double-spending

- [ ] Optimistic rollups for reduced verification latency- ✅ **Cryptographic signatures** - Ed25519 signatures on all cross-chain messages

- [ ] Cross-chain oracle integration (Chainlink, Band Protocol)- ✅ **Event-driven architecture** - Relayer only acts on verified blockchain events

- [ ] Mobile SDK for native app integration

- [ ] Hardware wallet support (Ledger, Trezor)### Production Recommendations



---- 🔐 Use **distributed guardians** (3-7 independent operators)

- 🔐 Store guardian keys in **HSM or secure enclaves**

## 🏗️ Smart Contract Architecture- 🔐 Implement **rate limiting** on lock/release functions

- 🔐 Add **time locks** for large transfers

### Soroban Bridge Contract- 🔐 Conduct **third-party security audit** before mainnet

- 🔐 Set up **monitoring and alerts** for suspicious activity

**Contract ID (Testnet)**: `CBP2ON6K7NOKOW4RDBNNXPFMIIMTMAUUS2EKZE7FFQQDDV5K7PINBDBR`

## 📝 Usage Example

**Explorer**: [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CBP2ON6K7NOKOW4RDBNNXPFMIIMTMAUUS2EKZE7FFQQDDV5K7PINBDBR)

### Lock Tokens on Stellar → Mint Wrapped on NEAR

#### Data Structures

1. **User calls `lock()` on Soroban contract**

```rust   ```javascript

// Storage keys for persistent data   // Using Stellar SDK

pub enum DataKey {   const result = await contract.lock({

    Guardians,           // Authorized validator public keys     token: tokenAddress,

    Quorum,              // Required signature count     amount: 1000000000, // 1000 tokens (with 6 decimals)

    LockNonce,           // Outgoing transfer counter     recipient_chain: 2, // NEAR

    ProcessedVAA(u64),   // Replay protection     recipient: nearAccountBytes

    Admin,               // Contract administrator   });

}   ```



// Lock event emitted on token lock2. **Relayer observes lock event**

pub struct LockEvent {   - Creates VAA with event details

    pub asset: Address,          // Token being locked   - Signs with guardian key(s)

    pub amount: i128,            // Amount locked

    pub sender: Address,         // Stellar sender address3. **Relayer submits VAA to NEAR**

    pub recipient_chain: u32,    // Destination chain ID (2 = NEAR)   ```bash

    pub recipient: BytesN<32>,   // NEAR recipient address   near call bridge.myaccount.testnet mint_wrapped '{"vaa_json": "..."}' --accountId relayer.testnet

    pub nonce: u64,              // Unique transfer ID   ```

    pub timestamp: u64,          // Lock timestamp

}4. **NEAR contract verifies VAA and mints wrapped tokens**

```

### Burn Wrapped on NEAR → Release on Stellar

#### Core Functions

Reverse flow: user burns wrapped tokens on NEAR, relayer creates VAA, submits to Stellar contract which releases locked tokens.

1. **`initialize(admin, guardians, quorum)`**

   - One-time setup of bridge contract## 🧪 Testing

   - Sets admin, guardian list, and signature quorum

   - Can only be called once### Unit Tests



2. **`lock(token, amount, recipient_chain, recipient)`**```powershell

   - Locks tokens on Stellar for cross-chain transfer# Test Soroban contract

   - Emits LockEvent with transfer detailscd contracts/soroban-bridge

   - Returns unique nonce for trackingcargo test

   - Requires token approval

# Test NEAR contract

3. **`release(vaa_bytes)`**cd ../near-bridge

   - Releases tokens after guardian verificationcargo test

   - Validates VAA signatures against guardians

   - Checks replay protection# Test shared library

   - Transfers tokens to recipientcd ../../shared

cargo test

4. **`get_lock_nonce()`**```

   - Returns current lock nonce counter

   - Used for tracking total transfers### Integration Tests



5. **`is_vaa_processed(nonce)`**```powershell

   - Checks if a VAA has been processed# Run full integration test (requires both testnets)

   - Prevents replay attackscd tests

cargo test --test integration

6. **`update_guardians(new_guardians, new_quorum)`**```

   - Admin-only function

   - Updates guardian set and quorum### Local Sandbox Testing

   - Enables guardian rotation

```powershell

---# Start local Soroban sandbox

soroban network start local

## 📦 Deployment Information

# Deploy and test locally

### Testnet Deployment# (Add specific test scripts)

```

- **Network**: Stellar Testnet (Test SDF Network ; September 2015)

- **Contract ID**: `CBP2ON6K7NOKOW4RDBNNXPFMIIMTMAUUS2EKZE7FFQQDDV5K7PINBDBR`## 🔧 Configuration

- **Deployer**: `bridge-deployer` keypair

- **Admin Address**: `GBMMOUKTQ5NDF7XFC6RA2CP3J32TWNN7PU7POH2SCQW4L3OEKM7BKP6D`### Guardian Setup

- **Guardians**: 2 test guardians configured

- **Quorum**: 2/2 signatures requiredThe bridge uses **guardian signatures** for security. For testnet:

- **WASM Size**: 11,496 bytes (optimized from 21,066 bytes)

```toml

### Deployment Steps# Minimum 1 guardian for testing

guardians = ["pubkey1_hex"]

```bashquorum = 1

# 1. Build the contract```

cargo build --target wasm32-unknown-unknown --release

For production:

# 2. Optimize WASM

stellar contract optimize --wasm target/wasm32-unknown-unknown/release/soroban_bridge.wasm```toml

# Recommended: 5-7 guardians, 2/3 quorum

# 3. Generate deployer keypairguardians = ["pubkey1", "pubkey2", "pubkey3", "pubkey4", "pubkey5"]

stellar keys generate bridge-deployer --network testnetquorum = 4  # 4 of 5 required

```

# 4. Fund deployer account

stellar keys fund bridge-deployer --network testnet### Supported Assets



# 5. Deploy contract- Stellar native assets (XLM)

stellar contract deploy \- Stellar custom tokens (SAC tokens)

  --wasm target/wasm32-unknown-unknown/release/soroban_bridge.optimized.wasm \- NEAR native (wrapped as NEAR on Stellar side)

  --source bridge-deployer \- Custom asset registration (extend contracts)

  --network testnet

## 📚 Documentation

# 6. Initialize contract

stellar contract invoke \- [Soroban Documentation](https://soroban.stellar.org/docs)

  --id <CONTRACT_ID> \- [NEAR Smart Contracts](https://docs.near.org/develop/contracts/introduction)

  --source bridge-deployer \- [Wormhole VAA Design](https://docs.wormhole.com/wormhole/explore-wormhole/vaa) (inspiration)

  --network testnet \

  -- initialize \## 🛠️ Development

  --admin <ADMIN_ADDRESS> \

  --guardians '[<GUARDIAN_1>, <GUARDIAN_2>]' \### Adding New Features

  --quorum 2

```1. **Add new chain support**: Implement new client in `relayer/src/`

2. **Modify VAA format**: Update `shared/src/lib.rs` (version bump required)

---3. **Add admin functions**: Extend contracts with proper access control



## 🚀 Getting Started### Code Style



### Prerequisites```powershell

# Format all code

- **Rust** 1.70+ with `wasm32-unknown-unknown` targetcargo fmt --all

- **Stellar CLI** (`stellar-cli` 23.1.4+)

- **Node.js** 18+ (for frontend)# Lint

- **Freighter Wallet** browser extensioncargo clippy --all-targets --all-features

```

### Installation

## ⚠️ Important Notes

```bash

# Clone the repository### Testnet vs Mainnet

git clone https://github.com/yourusername/aurora-bridge.git

cd aurora-bridge- **Testnet**: Use for development and testing only

- **Mainnet**: Requires thorough auditing and testing

# Install Rust dependencies

cargo build### Known Limitations



# Install frontend dependencies- ⚠️ Relayer clients (Horizon/NEAR) use placeholder implementations - must be completed for production

cd frontend- ⚠️ VAA parsing in contracts is simplified - implement full deserialization

npm install- ⚠️ Single relayer = centralization risk - deploy multiple in production

```- ⚠️ No automated guardian key rotation - implement for long-term operation



### Running Locally## 🤝 Contributing



```bashContributions welcome! Please:

# Terminal 1: Start frontend

cd frontend1. Fork the repository

npm run dev2. Create a feature branch

3. Add tests for new functionality

# Terminal 2: Run contract tests4. Submit a pull request

cd contracts/soroban-bridge

cargo test## 📄 License

```

MIT License - see LICENSE file for details

### Using the Bridge

## 🆘 Support

1. **Install Freighter Wallet**: Download from [freighter.app](https://www.freighter.app/)

2. **Get Testnet XLM**: Fund your account using Stellar's Friendbot- GitHub Issues: [Report bugs or request features]

3. **Connect Wallet**: Visit `http://localhost:3000` and click "Connect Wallet"- Documentation: See `/docs` folder (if added)

4. **Bridge Tokens**: - Stellar Discord: [Stellar Development](https://discord.gg/stellar)

   - Select source chain (Stellar)- NEAR Discord: [NEAR Protocol](https://discord.gg/near)

   - Enter amount and NEAR recipient address

   - Approve transaction in Freighter## 🎯 Roadmap

   - Wait for guardian verification

   - Tokens released on NEAR- [ ] Complete Horizon event polling implementation

- [ ] Add NEAR event listening with proper RPC calls

---- [ ] Implement transaction building and submission

- [ ] Add monitoring dashboard

## 📚 Contract Functions- [ ] Create formal verification tests

- [ ] Deploy to mainnet (after audit)

### User Functions- [ ] Add support for more chains (Solana, Ethereum, etc.)



#### `lock(token, amount, recipient_chain, recipient) -> u64`---



Locks tokens on Stellar for cross-chain transfer to NEAR.**⚠️ SECURITY WARNING**: This is educational/reference code. Do NOT use in production without:

- Professional security audit

**Parameters:**- Comprehensive testing on testnets

- `token: Address` - Token contract address (use sender's address for XLM)- Proper key management infrastructure

- `amount: i128` - Amount in stroops (1 XLM = 10^7 stroops)- Monitoring and incident response procedures

- `recipient_chain: u32` - Destination chain ID (2 for NEAR)
- `recipient: BytesN<32>` - NEAR account ID (32-byte format)

**Returns:** Unique nonce for tracking the transfer

**Example:**
```rust
let nonce = client.lock(
    &token_address,
    &10_000_000,  // 1 XLM
    &2,           // NEAR chain
    &recipient
);
```

---

#### `get_lock_nonce() -> u64`

Returns the current lock nonce counter.

**Returns:** Current nonce value

---

#### `is_vaa_processed(nonce) -> bool`

Checks if a VAA (cross-chain message) has been processed.

**Parameters:**
- `nonce: u64` - VAA nonce to check

**Returns:** `true` if processed, `false` otherwise

---

### Guardian Functions

#### `release(vaa_bytes)`

Releases tokens after guardian verification.

**Parameters:**
- `vaa_bytes: Bytes` - Serialized VAA with signatures

**Process:**
1. Deserialize VAA and extract signatures
2. Verify guardian signatures meet quorum
3. Check replay protection
4. Transfer tokens to recipient
5. Mark VAA as processed

---

### Admin Functions

#### `initialize(admin, guardians, quorum)`

One-time initialization of the bridge contract.

**Parameters:**
- `admin: Address` - Admin address for contract management
- `guardians: Vec<BytesN<32>>` - List of guardian public keys
- `quorum: u32` - Minimum signatures required

**Restrictions:** Can only be called once

---

#### `update_guardians(new_guardians, new_quorum)`

Updates the guardian set and quorum requirement.

**Parameters:**
- `new_guardians: Vec<BytesN<32>>` - New guardian list
- `new_quorum: u32` - New quorum requirement

**Restrictions:** Admin-only function

---

## 🛠️ Technical Stack

### Smart Contracts
- **Soroban SDK** (v22.0.8): Stellar smart contract framework
- **Rust**: Memory-safe systems programming
- **WASM**: WebAssembly for cross-platform execution

### Frontend
- **Next.js** (14.2.33): React framework with SSR
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Zustand**: Lightweight state management

### Blockchain Integration
- **@stellar/stellar-sdk** (12.3.0): Stellar blockchain interaction
- **@stellar/freighter-api** (5.0.0): Official wallet integration
- **Stellar Horizon**: Blockchain data access
- **Soroban RPC**: Smart contract invocation

### Development Tools
- **Stellar CLI**: Contract deployment and testing
- **Cargo**: Rust package manager
- **npm**: Frontend dependency management

---

## 📁 Project Structure

```
stellar-bridge-project/
├── contracts/
│   ├── soroban-bridge/          # Stellar Soroban contract
│   │   ├── src/lib.rs           # Main contract logic
│   │   └── Cargo.toml
│   └── near-bridge/             # NEAR contract
│       ├── src/lib.rs
│       └── Cargo.toml
├── relayer/                     # Off-chain relayer service
│   ├── src/
│   │   ├── main.rs              # Relayer entry point
│   │   ├── stellar.rs           # Stellar client
│   │   └── near.rs              # NEAR client
│   └── Cargo.toml
├── shared/                      # Shared types and utilities
│   ├── src/lib.rs               # VAA format and crypto
│   └── Cargo.toml
├── frontend/                    # Next.js web application
│   ├── components/              # React components
│   ├── lib/                     # Utilities and state
│   ├── pages/                   # Next.js pages
│   ├── public/                  # Static assets
│   └── package.json
├── scripts/                     # Deployment scripts
│   └── initialize-contract.sh
├── Cargo.toml                   # Workspace configuration
├── .env.local                   # Environment variables
├── PROJECT_STRUCTURE.md         # Detailed documentation
└── README.md                    # This file
```

---

## 📄 License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Contact & Support

- **Website**: [aurorabridge.io](https://aurorabridge.io)
- **Documentation**: [docs.aurorabridge.io](https://docs.aurorabridge.io)
- **Discord**: [Join our community](https://discord.gg/aurorabridge)
- **Twitter**: [@AuroraBridge](https://twitter.com/aurorabridge)
- **Email**: support@aurorabridge.io

---

## 🙏 Acknowledgments

- **Stellar Development Foundation** for Soroban SDK
- **NEAR Protocol** for blockchain infrastructure
- **Wormhole** for cross-chain messaging inspiration
- **Community Contributors** for testing and feedback

---

## ⚠️ Security Notice

This is a testnet deployment for educational and development purposes. **DO NOT use in production** without:

- ✅ Professional security audit
- ✅ Comprehensive testing on testnets
- ✅ Proper key management infrastructure (HSM/secure enclaves)
- ✅ Monitoring and incident response procedures
- ✅ Insurance coverage for bridge operations

---

**Built with ❤️ for a unified Web3 ecosystem**
<img width="1917" height="918" alt="Screenshot 2025-11-02 155725" src="https://github.com/user-attachments/assets/fda7ef64-3fc4-4cbb-b409-284d4e377404" />


