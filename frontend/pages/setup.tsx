import Head from 'next/head';
import { motion } from 'framer-motion';

export default function Setup() {
  return (
    <>
      <Head>
        <title>Setup Freighter - Stellar Bridge</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
              🚀 Freighter Wallet Setup Guide
            </h1>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="border-l-4 border-blue-500 pl-6 py-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Step 1: Install Freighter Extension
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Download and install the Freighter browser extension
                </p>
                <a
                  href="https://www.freighter.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  📥 Download Freighter
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  Available for Chrome, Edge, Firefox, and Brave browsers
                </p>
              </div>

              {/* Step 2 */}
              <div className="border-l-4 border-green-500 pl-6 py-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Step 2: Enable the Extension
                </h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p className="font-semibold">For Chrome/Edge:</p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Open your browser</li>
                    <li>Type <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">chrome://extensions/</code> or <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">edge://extensions/</code> in the address bar</li>
                    <li>Find "Freighter" in the list</li>
                    <li>Make sure the toggle switch is <strong className="text-green-600">ON (blue/green)</strong></li>
                    <li>Click "Details" and ensure "Allow in incognito" is checked if needed</li>
                  </ol>

                  <p className="font-semibold mt-4">For Firefox:</p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Type <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">about:addons</code> in the address bar</li>
                    <li>Click "Extensions" on the left</li>
                    <li>Find "Freighter"</li>
                    <li>Make sure it shows <strong className="text-green-600">"Enabled"</strong></li>
                  </ol>
                </div>
              </div>

              {/* Step 3 */}
              <div className="border-l-4 border-purple-500 pl-6 py-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Step 3: Pin the Extension to Toolbar
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                  <li>Look for the puzzle piece icon 🧩 in your browser toolbar (top-right)</li>
                  <li>Click it to see all extensions</li>
                  <li>Find "Freighter" in the list</li>
                  <li>Click the pin icon 📌 next to it</li>
                  <li>The Freighter icon should now appear in your toolbar</li>
                </ol>
                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-purple-900 dark:text-purple-100">
                    💡 <strong>Tip:</strong> Once pinned, you'll see the Freighter icon permanently in your toolbar
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="border-l-4 border-orange-500 pl-6 py-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Step 4: Activate Freighter
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                  <li>Click the Freighter icon in your toolbar</li>
                  <li>You should see the Freighter wallet interface</li>
                  <li>Create a new wallet OR import existing wallet</li>
                  <li>Set up your password</li>
                  <li>Make sure you're on <strong className="text-orange-600">TESTNET</strong> (for testing)</li>
                </ol>
                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-sm text-orange-900 dark:text-orange-100">
                    ⚠️ <strong>Important:</strong> Save your recovery phrase in a safe place!
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="border-l-4 border-red-500 pl-6 py-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Step 5: Return to Bridge and Test
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                  <li>Go back to the <a href="/" className="text-blue-600 hover:underline font-semibold">Bridge homepage</a></li>
                  <li>Refresh the page (F5 or Ctrl+R)</li>
                  <li>The red warning banner should disappear</li>
                  <li>Click "Connect Wallet" button</li>
                  <li>Freighter popup should appear asking for permission</li>
                  <li>Click "Approve" to connect</li>
                </ol>
              </div>

              {/* Troubleshooting */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mb-4">
                  🔧 Still Not Working?
                </h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p><strong>Try these fixes:</strong></p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Completely close and reopen your browser</li>
                    <li>Disable and re-enable the Freighter extension</li>
                    <li>Uninstall and reinstall Freighter</li>
                    <li>Try a different browser (Chrome, Edge, Firefox, Brave)</li>
                    <li>Clear browser cache and cookies</li>
                    <li>Check if other extensions are conflicting</li>
                    <li>Open browser console (F12) and check for errors</li>
                  </ul>
                  
                  <div className="mt-4 pt-4 border-t border-yellow-300 dark:border-yellow-700">
                    <p className="font-semibold mb-2">Run diagnostics:</p>
                    <div className="flex gap-3">
                      <a
                        href="/diagnostic"
                        className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        🔍 Run Diagnostic
                      </a>
                      <a
                        href="/"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        🏠 Back to Bridge
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Tutorial */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  📺 Need Visual Help?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Visit the official Freighter documentation for video tutorials and screenshots:
                </p>
                <a
                  href="https://docs.freighter.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  📖 View Official Docs
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
