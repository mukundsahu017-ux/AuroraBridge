# Stellar Bridge Frontend

A modern, responsive Next.js frontend for the Stellar ↔ NEAR cross-chain bridge with smooth animations and full Stellar SDK integration.

## Features

- 🎨 **Modern UI/UX** - Built with Next.js 14, TypeScript, and Tailwind CSS
- ✨ **Smooth Animations** - Framer Motion for fluid transitions and interactions
- 🌓 **Dark Mode** - Full dark mode support with system preference detection
- 💰 **Wallet Integration** - Freighter wallet connection with balance display
- 🌉 **Bridge Interface** - Intuitive token bridging between Stellar and NEAR
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ⚡ **Real-time Updates** - Live transaction status and balance updates
- 🔒 **Secure** - Direct interaction with Soroban smart contracts via Stellar SDK

## Prerequisites

- Node.js 18+ and npm/yarn
- Freighter wallet browser extension
- Stellar testnet account with XLM

## Quick Start

### 1. Install Dependencies

```powershell
cd frontend
npm install
```

### 2. Configure Environment

```powershell
cp .env.example .env.local
```

Edit `.env.local` and add your bridge contract ID:

```env
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_BRIDGE_CONTRACT_ID=YOUR_CONTRACT_ID_HERE
```

### 3. Run Development Server

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```powershell
npm run build
npm start
```

## Project Structure

```
frontend/
├── components/
│   ├── WalletButton.tsx       # Wallet connection component
│   └── BridgeInterface.tsx    # Main bridge UI
├── lib/
│   ├── store.ts               # Zustand state management
│   └── stellar.ts             # Stellar SDK integration
├── pages/
│   ├── _app.tsx               # App wrapper with toast notifications
│   ├── _document.tsx          # HTML document structure
│   └── index.tsx              # Main page
├── styles/
│   └── globals.css            # Global styles and Tailwind config
├── public/                    # Static assets
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## Usage

### Connect Wallet

1. Click "Connect Wallet" button
2. Approve connection in Freighter wallet
3. Your address and balance will be displayed

### Bridge Tokens

1. Select source and destination chains
2. Enter amount to bridge
3. Enter recipient address on destination chain
4. Click "Bridge Tokens"
5. Approve transaction in Freighter
6. Wait for confirmation (2-5 minutes)

### View Transaction

After bridging, click the transaction link to view details on Stellar Expert.

## Technologies

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Blockchain**: Stellar SDK (@stellar/stellar-sdk)
- **Notifications**: React Hot Toast
- **Wallet**: Freighter integration

## Customization

### Theme Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
colors: {
  stellar: {
    // Your custom Stellar colors
  },
  near: {
    // Your custom NEAR colors
  },
}
```

### Animations

Modify animations in `tailwind.config.js` and component files:

```js
animation: {
  'float': 'float 3s ease-in-out infinite',
  'shimmer': 'shimmer 2s linear infinite',
}
```

## Deployment

### Vercel (Recommended)

```powershell
npm install -g vercel
vercel
```

### Static Export

```powershell
npm run build
# Deploy the .next/out directory
```

### Docker

```powershell
docker build -t stellar-bridge-frontend .
docker run -p 3000:3000 stellar-bridge-frontend
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_STELLAR_NETWORK` | Network (TESTNET or PUBLIC) | TESTNET |
| `NEXT_PUBLIC_HORIZON_URL` | Horizon API endpoint | testnet |
| `NEXT_PUBLIC_SOROBAN_RPC_URL` | Soroban RPC endpoint | testnet |
| `NEXT_PUBLIC_BRIDGE_CONTRACT_ID` | Deployed contract ID | (required) |

## Troubleshooting

### Freighter Not Detected

- Install [Freighter wallet](https://www.freighter.app/)
- Refresh the page after installation

### Transaction Fails

- Ensure sufficient XLM balance for fees
- Check contract ID is correct
- Verify network matches (testnet/mainnet)

### Build Errors

```powershell
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- [Stellar Documentation](https://developers.stellar.org)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

**Note**: This is a testnet application. Do not use with real funds without proper auditing and testing.
