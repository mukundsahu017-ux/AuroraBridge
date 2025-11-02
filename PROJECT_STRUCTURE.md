# Stellar Bridge Project Structure

## 📁 Complete Project Organization

```
stellar-bridge-project/
│
├── 📄 Cargo.toml                    # Rust workspace configuration
├── 📄 Cargo.lock                    # Dependency lock file
├── 📄 README.md                     # Main project documentation
├── 📄 QUICKSTART.ps1                # Quick setup guide (PowerShell)
├── 📄 .env.example                  # Environment variables template
├── 📄 .gitignore                    # Git ignore rules
│
├── 📂 contracts/                    # Smart Contracts
│   ├── 📂 soroban-bridge/          # Stellar Soroban Contract
│   │   ├── Cargo.toml              # Contract dependencies
│   │   └── src/
│   │       └── lib.rs              # Bridge contract (lock/release)
│   │
│   └── 📂 near-bridge/             # NEAR Protocol Contract  
│       ├── Cargo.toml              # Contract dependencies
│       └── src/
│           └── lib.rs              # Bridge contract (mint/burn)
│
├── 📂 shared/                       # Shared Libraries
│   ├── Cargo.toml                  # Shared crate config
│   └── src/
│       └── lib.rs                  # VAA message format + crypto
│
├── 📂 relayer/                      # Off-Chain Relayer Service
│   ├── Cargo.toml                  # Relayer dependencies
│   ├── .env.example                # Relayer config template
│   └── src/
│       ├── main.rs                 # Main relayer logic
│       ├── config.rs               # Configuration management
│       ├── horizon_client.rs       # Stellar Horizon API client
│       └── near_client.rs          # NEAR RPC client
│
├── 📂 scripts/                      # Deployment Scripts
│   ├── deploy-soroban.ps1          # Deploy Stellar contract
│   └── deploy-near.ps1             # Deploy NEAR contract
│
└── 📂 frontend/                     # Next.js Web Application
    ├── package.json                # NPM dependencies
    ├── next.config.js              # Next.js configuration
    ├── tailwind.config.js          # Tailwind CSS config
    ├── tsconfig.json               # TypeScript configuration
    ├── .env.example                # Frontend env template
    ├── .env.local                  # Frontend env (local)
    ├── .gitignore                  # Frontend git ignore
    ├── README.md                   # Frontend documentation
    │
    ├── 📂 .vscode/                 # VS Code Settings
    │   └── settings.json           # Editor configuration
    │
    ├── 📂 pages/                   # Next.js Pages
    │   ├── _app.tsx                # App wrapper + Toaster
    │   ├── _document.tsx           # HTML document
    │   └── index.tsx               # Main landing page
    │
    ├── 📂 components/              # React Components
    │   ├── WalletButton.tsx        # Freighter wallet connector
    │   └── BridgeInterface.tsx     # Main bridge UI
    │
    ├── 📂 lib/                     # Libraries & Utilities
    │   ├── store.ts                # Zustand state management
    │   └── stellar.ts              # Stellar SDK wrapper
    │
    ├── 📂 styles/                  # Styling
    │   └── globals.css             # Global CSS + Tailwind
    │
    └── 📂 public/                  # Static Assets
        └── (favicon, images, etc.)
```

## 🏗️ Architecture Overview

### **Backend (Rust)**
- **Soroban Contract**: Locks XLM on Stellar, emits events
- **NEAR Contract**: Mints wrapped tokens, burns on return
- **Relayer Service**: Monitors both chains, creates signed VAAs
- **Shared Library**: Common message format and cryptography

### **Frontend (Next.js/React)**
- **Pages**: Main landing page with wallet integration
- **Components**: Wallet button and bridge interface
- **State Management**: Zustand stores for wallet and bridge state
- **Stellar SDK**: Contract interaction and transaction signing
- **Styling**: Tailwind CSS with custom animations

## 🚀 Quick Start

### 1. **Build Contracts**
```powershell
# Build Soroban contract
cd stellar-bridge-project
cargo build --target wasm32-unknown-unknown --release --package soroban-bridge

# Build NEAR contract (requires cargo-near)
cd contracts/near-bridge
cargo near build
```

### 2. **Deploy Contracts**
```powershell
# Deploy to Stellar testnet
.\scripts\deploy-soroban.ps1

# Deploy to NEAR testnet
.\scripts\deploy-near.ps1
```

### 3. **Configure Relayer**
```powershell
cd relayer
cp .env.example .env
# Edit .env with your configuration
cargo run --release
```

### 4. **Run Frontend**
```powershell
cd frontend
npm install
# Update .env.local with contract ID
npm run dev
```

## 📦 Key Technologies

| Component | Technologies |
|-----------|-------------|
| **Stellar Contract** | Soroban SDK, Rust, WASM |
| **NEAR Contract** | NEAR SDK, Rust, WASM |
| **Relayer** | Tokio, Reqwest, Ed25519 |
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS 3.4, Framer Motion |
| **State** | Zustand 4.5 |
| **Blockchain** | Stellar SDK 12.3, Freighter Wallet |

## 🔒 Security Features

✅ Multi-signature guardian validation  
✅ Replay protection via nonces  
✅ Ed25519 cryptographic signatures  
✅ VAA (Verified Authenticated Action) format  
✅ Quorum-based approval system  

## 📝 Environment Variables

### Relayer (.env)
```
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_BRIDGE_CONTRACT=<CONTRACT_ID>
NEAR_RPC_URL=https://rpc.testnet.near.org
NEAR_BRIDGE_CONTRACT=<CONTRACT_ID>
GUARDIAN_PRIVATE_KEY=<HEX_KEY>
POLL_INTERVAL_SECS=10
```

### Frontend (.env.local)
```
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_BRIDGE_CONTRACT_ID=<CONTRACT_ID>
```

## 🛠️ Development Commands

```powershell
# Build all Rust components
cargo build --release

# Run tests
cargo test

# Build Soroban contract
cargo build --target wasm32-unknown-unknown --release --package soroban-bridge

# Run relayer
cd relayer && cargo run --release

# Frontend development
cd frontend && npm run dev

# Frontend production build
cd frontend && npm run build && npm start
```

## 📊 Project Status

✅ **Completed**
- Rust workspace setup
- Soroban bridge contract (lock/release)
- NEAR bridge contract (mint/burn)
- VAA message format with Ed25519
- Relayer service architecture
- Deployment scripts
- Next.js frontend with animations
- Wallet integration (Freighter)
- Bridge UI with state management

⚠️ **In Progress**
- Horizon/NEAR RPC client implementations
- End-to-end testing
- Production deployment

🔜 **Planned**
- Transaction history UI
- Multi-asset support
- Guardian management dashboard
- Mainnet deployment

## 📚 Documentation

- **README.md**: Main project overview
- **frontend/README.md**: Frontend setup guide
- **QUICKSTART.ps1**: Step-by-step setup
- **contracts/*/src/lib.rs**: Inline code documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Stellar Documentation: https://developers.stellar.org
- NEAR Documentation: https://docs.near.org
- Project Issues: GitHub Issues
- Community: Discord / Telegram

---

**Built with ❤️ for the decentralized future**
