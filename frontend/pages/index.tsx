import { motion } from 'framer-motion';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import WalletButton from '@/components/WalletButton';
import BridgeInterface from '@/components/BridgeInterface';
import FreighterCheck from '@/components/FreighterCheck';
import { useWalletStore } from '@/lib/store';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { isConnected, publicKey } = useWalletStore();

  useEffect(() => {
    setMounted(true);
    // Check for dark mode preference
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true' ||
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  if (!mounted) return null;

  return (
    <>
      <Head>
        <title>Stellar Bridge - Cross-Chain Token Transfer</title>
        <meta name="description" content="Bridge tokens between Stellar and NEAR networks" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Freighter Installation Check */}
      <FreighterCheck />

      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-stellar-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-near-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-3xl"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl gradient-bridge flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  🌉
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Stellar Bridge
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Cross-Chain Protocol
                  </p>
                </div>
              </motion.div>

              <div className="flex items-center gap-4">
                {/* Dark Mode Toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleDarkMode}
                  className="p-3 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  {darkMode ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </motion.button>

                <WalletButton />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h2 className="text-5xl md:text-6xl font-bold gradient-bridge bg-clip-text text-transparent">
                Bridge Assets Seamlessly
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Transfer tokens securely between Stellar and NEAR networks with our decentralized cross-chain bridge
              </p>
            </motion.div>

            {/* Stats */}
            {isConnected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg gradient-stellar flex items-center justify-center text-white">
                      ⭐
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Connected</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">Stellar</p>
                    </div>
                  </div>
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-500 truncate">
                    {publicKey}
                  </p>
                </div>

                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-white">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">Active</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Bridge ready for transfers
                  </p>
                </div>

                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg gradient-near flex items-center justify-center text-white">
                      🔷
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Destination</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">NEAR</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Ready to receive
                  </p>
                </div>
              </motion.div>
            )}

            {/* Bridge Interface */}
            <BridgeInterface />

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: '🔒',
                  title: 'Secure',
                  description: 'Multi-signature validation with guardian network',
                },
                {
                  icon: '⚡',
                  title: 'Fast',
                  description: 'Cross-chain transfers in 2-5 minutes',
                },
                {
                  icon: '🎯',
                  title: 'Reliable',
                  description: 'Built on production-grade infrastructure',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                © 2025 Stellar Bridge. Built with ❤️ for the decentralized future.
              </p>
              <div className="flex items-center gap-6">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://developers.stellar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Docs
                </a>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
