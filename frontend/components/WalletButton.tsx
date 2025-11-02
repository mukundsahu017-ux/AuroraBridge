import { motion } from 'framer-motion';
import { useWalletStore } from '@/lib/store';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function WalletButton() {
  const { isConnected, publicKey, balance, connect, disconnect } = useWalletStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    
    // Debug: Log what's available
    if (typeof window !== 'undefined') {
      console.log('Window check:', {
        hasFreighterApi: !!(window as any).freighterApi,
        hasFreighter: !!(window as any).freighter,
        allKeys: Object.keys(window).filter(k => k.toLowerCase().includes('freight'))
      });
    }
    
    try {
      await connect();
      toast.success('Wallet connected successfully!');
    } catch (error: any) {
      console.error('Connection error:', error);
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success('Wallet disconnected');
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && publicKey) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3"
      >
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {truncateAddress(publicKey)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {balance ? `${parseFloat(balance).toFixed(4)} XLM` : 'Loading...'}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDisconnect}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium shadow-lg hover:shadow-xl transition-shadow"
        >
          Disconnect
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleConnect}
      disabled={isLoading}
      className="px-6 py-3 rounded-lg gradient-stellar text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Connecting...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8h8V6z" clipRule="evenodd" />
          </svg>
          <span>Connect Wallet</span>
        </div>
      )}
    </motion.button>
  );
}
