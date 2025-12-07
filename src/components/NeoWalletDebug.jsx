/**
 * Neo Wallet Debug Panel
 * Helps diagnose wallet detection issues
 */

import React, { useState, useEffect } from 'react';
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

export default function NeoWalletDebug() {
  const wallet = useWallet();
  const [windowInfo, setWindowInfo] = useState({});
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const checkWallets = () => {
      setWindowInfo({
        hasNEOLine: typeof window.NEOLine !== 'undefined',
        hasNEOLineNEO: typeof window.NEOLine?.NEO !== 'undefined',
        neoLineVersion: window.NEOLine?.VERSION || 'N/A',
        hasO3: typeof window.o3dapi !== 'undefined',
        hasOneGate: typeof window.OneGate !== 'undefined',
        neoKeys: Object.keys(window).filter(k => 
          k.toLowerCase().includes('neo') || 
          k.toLowerCase().includes('o3') ||
          k.toLowerCase().includes('gate')
        )
      });
    };

    checkWallets();
    const interval = setInterval(checkWallets, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 px-4 py-2 bg-[#FFD93D] border-4 border-[#0A0A0F] rounded-xl font-bold text-sm shadow-[4px_4px_0px_0px_rgba(10,10,15,1)] hover:bg-[#FF6BCB] z-50"
      >
        🔍 Debug Wallets
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border-4 border-[#0A0A0F] rounded-xl shadow-[12px_12px_0px_0px_rgba(10,10,15,1)] p-4 max-h-[80vh] overflow-y-auto z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-lg">Wallet Debug Panel</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="w-8 h-8 bg-[#FF5252] border-2 border-[#0A0A0F] rounded-full flex items-center justify-center font-black"
        >
          ×
        </button>
      </div>

      <div className="space-y-3">
        {/* Window Detection */}
        <div className="bg-[#0A0A0F]/5 p-3 rounded-lg">
          <h4 className="font-bold text-sm mb-2">Window Detection</h4>
          <div className="space-y-1 text-xs font-mono">
            <StatusLine 
              label="window.NEOLine" 
              status={windowInfo.hasNEOLine} 
            />
            <StatusLine 
              label="window.NEOLine.NEO" 
              status={windowInfo.hasNEOLineNEO} 
            />
            <StatusLine 
              label="window.o3dapi" 
              status={windowInfo.hasO3} 
            />
            <StatusLine 
              label="window.OneGate" 
              status={windowInfo.hasOneGate} 
            />
            {windowInfo.hasNEOLine && (
              <div className="mt-2 text-[#00E599]">
                Version: {windowInfo.neoLineVersion}
              </div>
            )}
          </div>
        </div>

        {/* Adapter Status */}
        <div className="bg-[#0A0A0F]/5 p-3 rounded-lg">
          <h4 className="font-bold text-sm mb-2">Wallet Adapters</h4>
          <div className="space-y-2 text-xs">
            {wallet.wallets && wallet.wallets.length > 0 ? (
              wallet.wallets.map((w, i) => (
                <div key={i} className="border border-[#0A0A0F] rounded p-2">
                  <div className="font-bold">{w.name}</div>
                  <div className="font-mono text-[10px] space-y-1 mt-1">
                    <div>State: <span className={getStateColor(w.readyState)}>{w.readyState}</span></div>
                    <div>Has Adapter: {w.adapter ? '✅' : '❌'}</div>
                    {w.adapter && (
                      <div>Methods: {Object.keys(w.adapter).filter(k => typeof w.adapter[k] === 'function').length}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-[#FF5252]">No wallet adapters loaded</div>
            )}
          </div>
        </div>

        {/* Connection Status */}
        <div className="bg-[#0A0A0F]/5 p-3 rounded-lg">
          <h4 className="font-bold text-sm mb-2">Connection Status</h4>
          <div className="space-y-1 text-xs font-mono">
            <StatusLine label="Connected" status={wallet.connected} />
            <StatusLine label="Connecting" status={wallet.connecting} />
            {wallet.address && (
              <div className="text-[#00E599] mt-2">
                Address: {wallet.address.slice(0, 10)}...
              </div>
            )}
            {wallet.connectedWallet && (
              <div className="text-[#00E599]">
                Wallet: {wallet.connectedWallet.name}
              </div>
            )}
          </div>
        </div>

        {/* Neo Keys in Window */}
        {windowInfo.neoKeys && windowInfo.neoKeys.length > 0 && (
          <div className="bg-[#0A0A0F]/5 p-3 rounded-lg">
            <h4 className="font-bold text-sm mb-2">Window Keys</h4>
            <div className="text-xs font-mono space-y-1">
              {windowInfo.neoKeys.map((key, i) => (
                <div key={i} className="text-[#00E599]">• {key}</div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {!windowInfo.hasNEOLine && (
          <div className="bg-[#FF5252]/10 border-2 border-[#FF5252] p-3 rounded-lg">
            <div className="flex gap-2 items-start">
              <AlertCircle size={16} className="text-[#FF5252] mt-0.5" />
              <div className="text-xs">
                <div className="font-bold mb-1">NeoLine Not Detected</div>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Install NeoLine from Chrome Web Store</li>
                  <li>Enable the extension</li>
                  <li>Refresh this page</li>
                  <li>Check if extension icon appears</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <button
          onClick={() => window.location.reload()}
          className="w-full px-4 py-2 bg-[#00E599] border-3 border-[#0A0A0F] rounded-lg font-bold text-sm shadow-[3px_3px_0px_0px_rgba(10,10,15,1)] hover:bg-[#FFD93D] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh Page
        </button>
      </div>
    </div>
  );
}

function StatusLine({ label, status }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}:</span>
      <span className="flex items-center gap-1">
        {status ? (
          <>
            <CheckCircle size={12} className="text-[#00E599]" />
            <span className="text-[#00E599]">Yes</span>
          </>
        ) : (
          <>
            <AlertCircle size={12} className="text-[#FF5252]" />
            <span className="text-[#FF5252]">No</span>
          </>
        )}
      </span>
    </div>
  );
}

function getStateColor(state) {
  const colors = {
    'Installed': 'text-[#00E599]',
    'NotDetected': 'text-[#FF5252]',
    'Loadable': 'text-[#FFD93D]',
    'Unsupported': 'text-[#FF5252]'
  };
  return colors[state] || 'text-[#0A0A0F]/60';
}
