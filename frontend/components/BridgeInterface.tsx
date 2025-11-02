import { motion, AnimatePresence } from 'framer-motion';
import { useBridgeStore, useWalletStore } from '@/lib/store';
import { createBridgeClient } from '@/lib/stellar';
import { useState } from 'react';
import toast from 'react-hot-toast';

const chains = [
  { id: 'STELLAR', name: 'Stellar', color: 'from-stellar-500 to-stellar-700', icon: '⭐' },
  { id: 'NEAR', name: 'NEAR', color: 'from-near-500 to-near-700', icon: '🔷' },
];

export default function BridgeInterface() {
  const {
    sourceChain,
    destinationChain,
    amount,
    recipient,
    isProcessing,
    setAmount,
    setRecipient,
    setProcessing,
    setTxHash,
    setError,
    swapChains,
  } = useBridgeStore();

  const { isConnected, publicKey, network } = useWalletStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleBridge = async () => {
    if (!isConnected || !publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!recipient) {
      toast.error('Please enter recipient address');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const contractId = process.env.NEXT_PUBLIC_BRIDGE_CONTRACT_ID;
      if (!contractId) {
        throw new Error('Bridge contract not configured');
      }

      const client = createBridgeClient(contractId, network);

      // For Stellar -> NEAR transfers
      if (sourceChain === 'STELLAR') {
        const recipientChain = 2; // NEAR chain ID
        
        toast.loading('Building transaction...', { id: 'bridge-tx' });

        const txHash = await client.lockWithFreighter(
          publicKey,
          publicKey, // Using native XLM for now
          amount,
          recipientChain,
          recipient
        );

        setTxHash(txHash);
        toast.success('Transaction submitted!', { id: 'bridge-tx' });
        
        // Show success with transaction link
        toast.success(
          <div>
            <p>Bridge transaction successful!</p>
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline text-sm"
            >
              View on Explorer
            </a>
          </div>,
          { duration: 5000 }
        );
      } else {
        toast.error('NEAR -> Stellar bridging coming soon!');
      }
    } catch (error: any) {
      console.error('Bridge error:', error);
      setError(error.message || 'Failed to execute bridge transaction');
      toast.error(error.message || 'Bridge transaction failed');
    } finally {
      setProcessing(false);
    }
  };

  const sourceChainInfo = chains.find((c) => c.id === sourceChain);
  const destChainInfo = chains.find((c) => c.id === destinationChain);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold gradient-bridge bg-clip-text text-transparent mb-2">
            Cross-Chain Bridge
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Transfer assets between Stellar and NEAR networks
          </p>
        </div>

        {/* Source Chain */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From
            </label>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-2xl bg-gradient-to-r ${sourceChainInfo?.color} cursor-pointer`}
            >
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{sourceChainInfo?.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold">{sourceChainInfo?.name}</h3>
                    <p className="text-sm opacity-90">Source Network</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xl font-semibold focus:border-stellar-500 dark:focus:border-stellar-400 focus:ring-2 focus:ring-stellar-500/20 transition-all outline-none"
                disabled={isProcessing}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
                  XLM
                </span>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={swapChains}
              disabled={isProcessing}
              className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </motion.button>
          </div>

          {/* Destination Chain */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-2xl bg-gradient-to-r ${destChainInfo?.color} cursor-pointer`}
            >
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{destChainInfo?.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold">{destChainInfo?.name}</h3>
                    <p className="text-sm opacity-90">Destination Network</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recipient Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter destination address..."
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-near-500 dark:focus:border-near-400 focus:ring-2 focus:ring-near-500/20 transition-all outline-none font-mono"
              disabled={isProcessing}
            />
          </div>

          {/* Advanced Options */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              <span>{showAdvanced ? '▼' : '▶'}</span>
              <span>Advanced Options</span>
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-3"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Estimated Time:</span>
                    <span className="font-medium text-gray-900 dark:text-white">~2-5 minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Bridge Fee:</span>
                    <span className="font-medium text-gray-900 dark:text-white">0.1%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Network Fee:</span>
                    <span className="font-medium text-gray-900 dark:text-white">~0.001 XLM</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bridge Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBridge}
            disabled={!isConnected || isProcessing || !amount || !recipient}
            className="w-full py-5 rounded-2xl gradient-bridge text-white text-xl font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {isProcessing && (
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              />
            )}
            <span className="relative z-10">
              {isProcessing ? 'Processing...' : isConnected ? 'Bridge Tokens' : 'Connect Wallet First'}
            </span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
