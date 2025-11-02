import { create } from 'zustand';
import { 
  isConnected, 
  isAllowed, 
  setAllowed,
  getAddress,
  getNetwork
} from '@stellar/freighter-api';

export interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  balance: string | null;
  network: 'TESTNET' | 'PUBLIC';
  connect: () => Promise<void>;
  disconnect: () => void;
  updateBalance: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set: any, get: any) => ({
  isConnected: false,
  publicKey: null,
  balance: null,
  network: (process.env.NEXT_PUBLIC_STELLAR_NETWORK as 'TESTNET' | 'PUBLIC') || 'TESTNET',

  connect: async () => {
    try {
      // Check if window is available
      if (typeof window === 'undefined') {
        throw new Error('Window not available');
      }

      console.log('🔍 Checking Freighter connection...');

      // Check if Freighter extension is installed and connected
      const connectedResponse = await isConnected();
      console.log('🔍 Connection response:', connectedResponse);
      
      if (connectedResponse.error || !connectedResponse.isConnected) {
        throw new Error(
          'Freighter wallet extension not installed or not enabled!\n\n' +
          'Please:\n' +
          '1. Install Freighter from https://www.freighter.app/\n' +
          '2. Enable the extension in your browser\n' +
          '3. Click the Freighter icon in your toolbar\n' +
          '4. Refresh this page'
        );
      }

      console.log('✅ Freighter is connected');

      // Check if we're allowed to access the wallet
      const allowedResponse = await isAllowed();
      console.log('🔐 Allowed response:', allowedResponse);
      
      if (allowedResponse.error || !allowedResponse.isAllowed) {
        console.log('🔐 Requesting permission...');
        const setAllowedResponse = await setAllowed();
        
        if (setAllowedResponse.error || !setAllowedResponse.isAllowed) {
          throw new Error('User denied access to Freighter');
        }
      }

      console.log('🔐 Requesting address...');

      // Get the address (public key) from Freighter
      const addressResponse = await getAddress();
      console.log('✅ Address response:', addressResponse);
      
      if (addressResponse.error || !addressResponse.address) {
        throw new Error('No address received. Please make sure you have an account in Freighter.');
      }

      console.log('✅ Address received:', addressResponse.address.substring(0, 10) + '...');

      // Get network
      const networkResponse = await getNetwork();
      console.log('✅ Network response:', networkResponse);

      if (networkResponse.error) {
        throw new Error('Failed to get network from Freighter');
      }

      set({
        isConnected: true,
        publicKey: addressResponse.address,
        network: networkResponse.network.toUpperCase() as 'TESTNET' | 'PUBLIC',
      });

      // Fetch initial balance
      await get().updateBalance();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  },

  disconnect: () => {
    set({
      isConnected: false,
      publicKey: null,
      balance: null,
    });
  },

  updateBalance: async () => {
    const { publicKey, network } = get();
    if (!publicKey) return;

    try {
      const horizonUrl = network === 'TESTNET'
        ? 'https://horizon-testnet.stellar.org'
        : 'https://horizon.stellar.org';

      const response = await fetch(`${horizonUrl}/accounts/${publicKey}`);
      const account = await response.json();

      // Get XLM balance
      const xlmBalance = account.balances.find(
        (b: any) => b.asset_type === 'native'
      );

      set({ balance: xlmBalance?.balance || '0' });
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  },
}));

export interface BridgeState {
  sourceChain: 'STELLAR' | 'NEAR';
  destinationChain: 'STELLAR' | 'NEAR';
  amount: string;
  recipient: string;
  isProcessing: boolean;
  txHash: string | null;
  error: string | null;
  setSourceChain: (chain: 'STELLAR' | 'NEAR') => void;
  setDestinationChain: (chain: 'STELLAR' | 'NEAR') => void;
  setAmount: (amount: string) => void;
  setRecipient: (recipient: string) => void;
  setProcessing: (processing: boolean) => void;
  setTxHash: (hash: string | null) => void;
  setError: (error: string | null) => void;
  swapChains: () => void;
  reset: () => void;
}

export const useBridgeStore = create<BridgeState>((set: any, get: any) => ({
  sourceChain: 'STELLAR',
  destinationChain: 'NEAR',
  amount: '',
  recipient: '',
  isProcessing: false,
  txHash: null,
  error: null,

  setSourceChain: (chain: 'STELLAR' | 'NEAR') => set({ sourceChain: chain }),
  setDestinationChain: (chain: 'STELLAR' | 'NEAR') => set({ destinationChain: chain }),
  setAmount: (amount: string) => set({ amount }),
  setRecipient: (recipient: string) => set({ recipient }),
  setProcessing: (isProcessing: boolean) => set({ isProcessing }),
  setTxHash: (txHash: string | null) => set({ txHash }),
  setError: (error: string | null) => set({ error }),

  swapChains: () => {
    const { sourceChain, destinationChain } = get();
    set({
      sourceChain: destinationChain,
      destinationChain: sourceChain,
    });
  },

  reset: () => set({
    amount: '',
    recipient: '',
    isProcessing: false,
    txHash: null,
    error: null,
  }),
}));
