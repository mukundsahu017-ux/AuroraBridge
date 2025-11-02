import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function FreighterDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<any>(null);

  useEffect(() => {
    const runDiagnostics = () => {
      if (typeof window === 'undefined') {
        return;
      }

      const results = {
        timestamp: new Date().toISOString(),
        browser: navigator.userAgent,
        windowKeys: Object.keys(window).filter(k => 
          k.toLowerCase().includes('freight') || 
          k.toLowerCase().includes('stellar')
        ),
        freighterApi: {
          exists: !!(window as any).freighterApi,
          type: typeof (window as any).freighterApi,
          methods: (window as any).freighterApi ? Object.keys((window as any).freighterApi) : []
        },
        freighter: {
          exists: !!(window as any).freighter,
          type: typeof (window as any).freighter,
          methods: (window as any).freighter ? Object.keys((window as any).freighter) : []
        },
        extensions: {
          chrome: !!(window as any).chrome,
          browser: typeof (window as any).browser !== 'undefined'
        }
      };

      setDiagnostics(results);
      console.log('Freighter Diagnostics:', results);
    };

    // Run diagnostics with delays
    runDiagnostics();
    setTimeout(runDiagnostics, 1000);
    setTimeout(runDiagnostics, 3000);
  }, []);

  const testConnection = async () => {
    try {
      const freighterApi = (window as any).freighterApi || (window as any).freighter;
      
      if (!freighterApi) {
        alert('❌ Freighter not detected!\n\nPlease:\n1. Make sure Freighter extension is installed\n2. Refresh this page\n3. Check browser console for details');
        return;
      }

      alert('✅ Freighter detected!\n\nAttempting to get public key...');
      
      const publicKey = await freighterApi.getPublicKey();
      alert(`✅ Success!\n\nPublic Key: ${publicKey}`);
      
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
      console.error('Test connection error:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Freighter Diagnostic - Stellar Bridge</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              🔍 Freighter Extension Diagnostic
            </h1>

            <div className="space-y-6">
              {/* Test Button */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  Quick Test
                </h2>
                <button
                  onClick={testConnection}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Test Freighter Connection
                </button>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-3">
                  This will attempt to connect to Freighter and request your public key
                </p>
              </div>

              {/* Diagnostics Results */}
              {diagnostics && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Diagnostic Results
                  </h2>
                  
                  <div className="space-y-4 font-mono text-sm">
                    {/* Freighter API Status */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">
                          {diagnostics.freighterApi.exists ? '✅' : '❌'}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          window.freighterApi
                        </span>
                      </div>
                      {diagnostics.freighterApi.exists && (
                        <div className="ml-10 text-gray-600 dark:text-gray-400">
                          Methods: {diagnostics.freighterApi.methods.join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Freighter (legacy) Status */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">
                          {diagnostics.freighter.exists ? '✅' : '❌'}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          window.freighter
                        </span>
                      </div>
                      {diagnostics.freighter.exists && (
                        <div className="ml-10 text-gray-600 dark:text-gray-400">
                          Methods: {diagnostics.freighter.methods.join(', ')}
                        </div>
                      )}
                    </div>

                    {/* All Freighter-related keys */}
                    {diagnostics.windowKeys.length > 0 && (
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white mb-2">
                          Found Window Keys:
                        </div>
                        <div className="ml-4 text-gray-600 dark:text-gray-400">
                          {diagnostics.windowKeys.join(', ')}
                        </div>
                      </div>
                    )}

                    {/* Browser Info */}
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-2">
                        Browser Extensions:
                      </div>
                      <div className="ml-4 text-gray-600 dark:text-gray-400">
                        Chrome API: {diagnostics.extensions.chrome ? '✅' : '❌'}
                        <br />
                        Browser API: {diagnostics.extensions.browser ? '✅' : '❌'}
                      </div>
                    </div>
                  </div>

                  {/* Raw JSON */}
                  <details className="mt-6">
                    <summary className="cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                      View Raw JSON
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-900 text-green-400 rounded-lg overflow-auto text-xs">
                      {JSON.stringify(diagnostics, null, 2)}
                    </pre>
                  </details>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
                  📋 Troubleshooting Steps
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Make sure Freighter extension is installed from <a href="https://www.freighter.app/" target="_blank" className="text-blue-600 hover:underline">freighter.app</a></li>
                  <li>Check that the extension is enabled in your browser settings</li>
                  <li>Click the Freighter icon in your browser toolbar to ensure it's active</li>
                  <li>Refresh this page (Ctrl+R or Cmd+R)</li>
                  <li>Open browser console (F12) to see detailed logs</li>
                  <li>Try the "Test Freighter Connection" button above</li>
                </ol>
              </div>

              {/* Back Link */}
              <div className="text-center pt-4">
                <a
                  href="/"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
                >
                  ← Back to Bridge
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
