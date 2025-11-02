import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function FreighterCheck() {
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [checkCount, setCheckCount] = useState(0);

  const checkFreighter = () => {
    if (typeof window !== 'undefined') {
      // Check all possible ways Freighter might be exposed
      const freighterApi = (window as any).freighterApi;
      const freighter = (window as any).freighter;
      const stellar = (window as any).stellar;
      
      // Check all window properties for anything Freighter-related
      const windowKeys = Object.keys(window);
      const freighterRelated = windowKeys.filter(k => 
        k.toLowerCase().includes('freight') || 
        k.toLowerCase().includes('stellar')
      );
      
      const detected = !!(freighterApi || freighter || stellar);
      
      console.log('🔍 Freighter Detection (Check #' + (checkCount + 1) + '):', { 
        hasFreighterApi: !!freighterApi,
        hasFreighter: !!freighter,
        hasStellar: !!stellar,
        detected: detected,
        relatedKeys: freighterRelated,
        extensionPresent: !!(window as any).chrome?.runtime || !!(window as any).browser?.runtime
      });
      
      // If detected, log the methods available
      if (detected) {
        const api = freighterApi || freighter || stellar;
        console.log('✅ Freighter API found! Methods:', Object.keys(api));
      } else {
        console.log('❌ Freighter NOT detected.');
        console.log('💡 Troubleshooting:');
        console.log('   1. Open browser extensions (chrome://extensions or edge://extensions)');
        console.log('   2. Find Freighter and make sure it is ENABLED');
        console.log('   3. Click the Freighter icon in your browser toolbar');
        console.log('   4. Click "Check Again" button below');
      }
      
      setIsInstalled(detected);
      setIsChecking(false);
      setCheckCount(prev => prev + 1);
    }
  };

  const handleCheckAgain = () => {
    setIsChecking(true);
    setTimeout(() => {
      checkFreighter();
    }, 500);
  };

  useEffect(() => {
    // Initial check
    checkFreighter();

    // Check again after delays (extension might load after page)
    const timeout1 = setTimeout(checkFreighter, 1000);
    const timeout2 = setTimeout(checkFreighter, 2000);
    const timeout3 = setTimeout(checkFreighter, 3500);
    const timeout4 = setTimeout(checkFreighter, 5000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
    };
  }, []);

  if (isChecking) {
    return null; // Don't show anything while checking
  }

  if (isInstalled) {
    return null; // Freighter is installed, no need to show banner
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-4 shadow-lg"
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold text-lg">⚠️ Freighter Wallet Extension Not Detected</p>
              <p className="text-sm opacity-90 mt-1">Please follow these steps:</p>
              <ul className="text-sm mt-2 space-y-1 opacity-90">
                <li>✓ Install Freighter from <a href="https://www.freighter.app/" target="_blank" className="underline font-semibold">freighter.app</a></li>
                <li>✓ Click the Freighter icon in your browser toolbar to activate it</li>
                <li>✓ Refresh this page after installation</li>
                <li>✓ Check console (F12) for detection logs</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheckAgain}
              disabled={isChecking}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg font-bold transition-colors text-sm whitespace-nowrap"
            >
              {isChecking ? '⏳ Checking...' : '🔄 Check Again'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors text-sm whitespace-nowrap"
            >
              🔄 Refresh Page
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/setup"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-bold transition-colors text-sm text-center whitespace-nowrap"
            >
              📋 Setup Guide
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/diagnostic"
              className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors text-sm text-center whitespace-nowrap"
            >
              🔍 Run Diagnostic
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-orange-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors text-center whitespace-nowrap"
            >
              📥 Install Freighter
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
