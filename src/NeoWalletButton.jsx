import React, { useState, useEffect } from 'react';
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { Wallet, LogOut, Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { useNeoBalance } from './hooks/useNeoBalance';

/**
 * NEO WALLET BUTTON - SOFT BRUTALISM STYLE
 * Custom styled Neo wallet connect button with real balance fetching
 */

export default function NeoWalletButton({ className = '' }) {
  const wallet = useWallet();
  const { balances, loading: balanceLoading, refresh } = useNeoBalance();
  const [copied, setCopied] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Debug wallet state
  useEffect(() => {
    console.log('Wallet State:', {
      address: wallet.address,
      connected: wallet.connected,
      connecting: wallet.connecting,
      walletName: wallet.connectedWallet?.name,
      availableWallets: wallet.wallets?.map(w => ({ 
        name: w.name, 
        readyState: w.readyState 
      }))
    });
  }, [wallet]);

  // Format Neo address
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Copy address to clipboard
  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle wallet connection with proper error handling and signature request
  const handleConnect = async (walletName) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      console.log('Attempting to connect to:', walletName);
      
      // Check if wallet is available
      const availableWallets = wallet.wallets || [];
      console.log('Available wallets:', availableWallets.map(w => ({ name: w.name, readyState: w.readyState })));
      
      const targetWallet = availableWallets.find(w => w.name === walletName);
      
      if (!targetWallet) {
        throw new Error(`${walletName} wallet not found. Please install it from the Chrome Web Store.`);
      }
      
      console.log('Target wallet readyState:', targetWallet.readyState);
      
      // More lenient readyState check - allow connection attempt even if state is unclear
      const notDetected = targetWallet.readyState === 'NotDetected' || targetWallet.readyState === 'Unsupported';
      if (notDetected) {
        throw new Error(`${walletName} is not installed. Please install the extension and refresh the page.`);
      }
      
      // Call connect method with the wallet adapter
      console.log('Calling wallet.connect with adapter...');
      await wallet.connect(targetWallet.adapter);
      
      console.log('Connected successfully! Now requesting signature...');
      
      // Request signature for authentication after connection
      try {
        const timestamp = Date.now();
        const message = `Sign in to EcoPrompt\n\nTimestamp: ${timestamp}\nAddress: ${wallet.address || 'connecting...'}`;
        
        console.log('Requesting signature for message:', message);
        
        // Use the wallet adapter's signMessage method
        if (targetWallet.adapter?.signMessage) {
          const signature = await targetWallet.adapter.signMessage({ message });
          console.log('Signature received:', signature);
          
          // Store signature authentication
          localStorage.setItem('neo_wallet_signature', JSON.stringify({
            address: wallet.address,
            timestamp,
            signature
          }));
        } else {
          console.warn('Wallet does not support message signing, skipping...');
        }
      } catch (signErr) {
        console.warn('Signature request failed or cancelled:', signErr);
        // Don't fail the connection if signature is cancelled
      }
      
      setShowWalletModal(false);
      
      // Store wallet preference
      localStorage.setItem('neo_wallet_preference', walletName);
      
    } catch (err) {
      console.error('Connection error:', err);
      
      // User-friendly error messages
      if (err.message?.includes('not installed') || err.message?.includes('not found') || err.message?.includes('not detected')) {
        setError(`${walletName} wallet not installed. Please install it first.`);
      } else if (err.message?.includes('rejected') || err.message?.includes('cancelled') || err.message?.includes('denied')) {
        setError('Connection cancelled by user');
      } else {
        setError(err.message || 'Failed to connect wallet. Make sure the extension is installed and enabled.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    try {
      await wallet.disconnect();
      localStorage.removeItem('neo_wallet_preference');
      localStorage.removeItem('neo_wallet_signature');
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  };

  // Manual sign-in function for already connected wallets
  const handleSignIn = async () => {
    if (!wallet.connected || !wallet.connectedWallet) {
      setError('Please connect your wallet first');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const timestamp = Date.now();
      const message = `Sign in to EcoPrompt\n\nTimestamp: ${timestamp}\nAddress: ${wallet.address}`;
      
      console.log('Requesting signature for sign-in...');
      
      // Use the connected wallet adapter's signMessage method
      if (wallet.connectedWallet.adapter?.signMessage) {
        const signature = await wallet.connectedWallet.adapter.signMessage({ message });
        console.log('Signature received:', signature);
        
        // Store signature authentication
        localStorage.setItem('neo_wallet_signature', JSON.stringify({
          address: wallet.address,
          timestamp,
          signature
        }));
        
        alert('Successfully signed in! Signature stored.');
      } else {
        throw new Error('Wallet does not support message signing');
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      if (err.message?.includes('rejected') || err.message?.includes('cancelled')) {
        setError('Sign-in cancelled by user');
      } else {
        setError(err.message || 'Failed to sign message');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Auto-reconnect on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('neo_wallet_preference');
    if (savedWallet && !wallet.connected && !wallet.connecting && wallet.wallets?.length > 0) {
      // Small delay to ensure wallets are loaded
      const timer = setTimeout(() => {
        handleConnect(savedWallet);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [wallet.wallets]);

  // Not connected - show connect button
  if (!wallet.connected && !wallet.connecting) {
    return (
      <div className={className}>
        <button
          onClick={() => setShowWalletModal(true)}
          disabled={isConnecting}
          className="
            flex items-center gap-2
            px-6 py-3
            bg-[#00E599]
            text-[#0A0A0F]
            border-4 border-[#0A0A0F]
            rounded-[24px]
            font-bold
            uppercase tracking-wide
            shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]
            hover:bg-[#FFD93D]
            active:translate-x-[2px] active:translate-y-[2px]
            active:shadow-none
            transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed
            w-full justify-center
          "
        >
          <Wallet size={20} strokeWidth={3} />
          {isConnecting ? 'Connecting...' : 'Connect Neo Wallet'}
        </button>

        {error && (
          <div className="mt-2 p-3 bg-[#FF5252]/10 border-2 border-[#FF5252] rounded-[16px] text-xs font-bold text-[#FF5252]">
            {error}
          </div>
        )}

        {/* Wallet Selection Modal */}
        {showWalletModal && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4"
            onClick={() => !isConnecting && setShowWalletModal(false)}
          >
            <div 
              className="
                bg-white
                border-4 border-[#0A0A0F]
                rounded-[32px]
                shadow-[12px_12px_0px_0px_rgba(10,10,15,1)]
                p-6
                max-w-md
                w-full
              "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black uppercase">Select Wallet</h3>
                <button
                  onClick={() => !isConnecting && setShowWalletModal(false)}
                  disabled={isConnecting}
                  className="
                    w-10 h-10
                    bg-[#FF5252]
                    border-3 border-[#0A0A0F]
                    rounded-full
                    flex items-center justify-center
                    font-black text-2xl
                    hover:scale-110
                    transition-transform
                    disabled:opacity-50
                  "
                >
                  ×
                </button>
              </div>

              <div className="space-y-3">
                {/* Map through available wallets */}
                {wallet.wallets && wallet.wallets.length > 0 ? (
                  wallet.wallets.map((w) => {
                    const walletConfig = {
                      'NeoLine': { icon: '🦊', color: '#00E599', url: 'https://neoline.io/en' },
                      'O3': { icon: '🔷', color: '#4FFFB0', url: 'https://o3.network' },
                      'OneGate': { icon: '🚪', color: '#B084FF', url: 'https://onegate.space' }
                    };
                    
                    const config = walletConfig[w.name] || { icon: '💼', color: '#FFD93D', url: '#' };
                    // Check if wallet is actually installed
                    const isInstalled = w.readyState && w.readyState !== 'NotDetected' && w.readyState !== 'Unsupported';
                    
                    return (
                      <WalletOption
                        key={w.name}
                        name={w.name}
                        icon={config.icon}
                        description={isInstalled ? `Ready to connect (${w.readyState})` : `Not installed - Click to download`}
                        color={config.color}
                        onClick={() => isInstalled ? handleConnect(w.name) : window.open(config.url, '_blank')}
                        isLoading={isConnecting}
                        isInstalled={isInstalled}
                        downloadUrl={config.url}
                      />
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-sm font-bold text-[#0A0A0F]/60">
                    <div className="mb-2">No Neo wallets detected.</div>
                    <div className="text-xs">Please install NeoLine, O3, or OneGate Wallet and refresh the page.</div>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-[#FF5252]/10 border-2 border-[#FF5252] rounded-[16px] text-sm font-bold text-[#FF5252]">
                  {error}
                </div>
              )}

              {/* Help Text */}
              <div className="mt-6 p-4 bg-[#4FFFB0]/10 border-3 border-[#4FFFB0] rounded-[16px] text-sm">
                <div className="font-bold mb-2">💡 New to Neo Wallets?</div>
                <p className="mb-3">
                  We recommend{' '}
                  <a
                    href="https://neoline.io/en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#00E599] underline hover:text-[#FFD93D]"
                  >
                    NeoLine
                  </a>
                  {' '}(Chrome/Firefox extension) for the best experience!
                </p>
                <div className="text-xs font-bold text-[#0A0A0F]/60">
                  After installing, refresh this page and click the connect button again.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Connecting state
  if (wallet.connecting || isConnecting) {
    return (
      <button
        disabled
        className="
          flex items-center gap-2
          px-6 py-3
          bg-[#FFD93D]
          text-[#0A0A0F]
          border-4 border-[#0A0A0F]
          rounded-[24px]
          font-bold
          uppercase tracking-wide
          shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]
          w-full justify-center
        "
      >
        <Wallet size={20} strokeWidth={3} className="animate-spin" />
        Connecting...
      </button>
    );
  }

  // Connected - show wallet info
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {/* Address Display with Balance */}
      <div className="
        flex items-center gap-2
        px-4 py-2
        bg-white
        border-4 border-[#0A0A0F]
        rounded-[20px]
        shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]
      ">
        <div className="
          w-8 h-8
          bg-[#00E599]
          border-2 border-[#0A0A0F]
          rounded-full
          flex items-center justify-center
        ">
          <Wallet size={16} strokeWidth={3} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xs">
            {formatAddress(wallet.address)}
          </span>
          <span className="font-mono text-[10px] text-[#00E599]">
            {balanceLoading ? '...' : `${parseFloat(balances.gas).toFixed(2)} GAS`}
          </span>
        </div>
      </div>

      {/* Refresh Balance Button */}
      <button
        onClick={refresh}
        disabled={balanceLoading}
        className="
          w-10 h-10
          bg-white
          border-4 border-[#0A0A0F]
          rounded-[16px]
          flex items-center justify-center
          shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]
          hover:bg-[#F5F5F5]
          active:translate-x-[2px] active:translate-y-[2px]
          active:shadow-none
          transition-all duration-150
          disabled:opacity-50
        "
        title="Refresh balance"
      >
        <RefreshCw 
          size={16} 
          strokeWidth={3} 
          className={balanceLoading ? 'animate-spin' : ''}
        />
      </button>

      {/* Copy Button */}
      <button
        onClick={copyAddress}
        className="
          w-10 h-10
          bg-white
          border-4 border-[#0A0A0F]
          rounded-[16px]
          flex items-center justify-center
          shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]
          hover:bg-[#F5F5F5]
          active:translate-x-[2px] active:translate-y-[2px]
          active:shadow-none
          transition-all duration-150
        "
        title="Copy address"
      >
        {copied ? (
          <Check size={16} strokeWidth={3} className="text-[#00E599]" />
        ) : (
          <Copy size={16} strokeWidth={3} />
        )}
      </button>

      {/* Sign In Button - Request Signature */}
      <button
        onClick={handleSignIn}
        disabled={isConnecting}
        className="
          px-4 py-2
          bg-[#FFD93D]
          border-4 border-[#0A0A0F]
          rounded-[16px]
          font-bold text-sm uppercase
          shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]
          hover:bg-[#FF6BCB]
          active:translate-x-[2px] active:translate-y-[2px]
          active:shadow-none
          transition-all duration-150
          disabled:opacity-50 disabled:cursor-not-allowed
          whitespace-nowrap
        "
        title="Sign in with signature"
      >
        {isConnecting ? '...' : '🔐 Sign In'}
      </button>

      {/* Disconnect Button */}
      <button
        onClick={handleDisconnect}
        className="
          w-10 h-10
          bg-[#FF5252]
          border-4 border-[#0A0A0F]
          rounded-[16px]
          flex items-center justify-center
          shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]
          hover:bg-[#FF5252]/80
          active:translate-x-[2px] active:translate-y-[2px]
          active:shadow-none
          transition-all duration-150
        "
        title="Disconnect"
      >
        <LogOut size={16} strokeWidth={3} className="text-white" />
      </button>
    </div>
  );
}

/**
 * WALLET OPTION COMPONENT
 */
const WalletOption = ({ 
  name, 
  icon, 
  description, 
  color,
  onClick, 
  isLoading,
  isInstalled = true,
  downloadUrl 
}) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`
      w-full
      p-4
      bg-white
      border-4 border-[#0A0A0F]
      rounded-[20px]
      flex items-center gap-4
      ${isInstalled 
        ? 'hover:bg-[#00E599]/10 hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_0px_rgba(10,10,15,1)]' 
        : 'opacity-60'
      }
      transition-all
      disabled:opacity-50 disabled:cursor-not-allowed
    `}
  >
    <div 
      className="w-12 h-12 border-3 border-[#0A0A0F] rounded-full flex items-center justify-center text-2xl"
      style={{ backgroundColor: color }}
    >
      {isLoading ? '⏳' : icon}
    </div>
    <div className="flex-1 text-left">
      <div className="font-black text-lg">{name}</div>
      <div className="text-sm text-[#0A0A0F]/60">{description}</div>
    </div>
    <div className="text-2xl">{isInstalled ? '→' : '📥'}</div>
  </button>
);

/**
 * NEO WALLET INFO CARD
 * Displays detailed Neo wallet information
 */

export function NeoWalletInfoCard() {
  const wallet = useWallet();
  const { balances, loading, error, lastUpdate, refresh } = useNeoBalance();

  if (!wallet.connected) {
    return (
      <div className="
        p-6
        bg-white
        border-4 border-[#0A0A0F]
        rounded-[32px]
        shadow-[8px_8px_0px_0px_rgba(10,10,15,1)]
        text-center
      ">
        <div className="
          w-20 h-20
          mx-auto mb-4
          bg-[#FFD93D]/20
          border-4 border-[#0A0A0F]
          rounded-full
          flex items-center justify-center
        ">
          <Wallet size={32} strokeWidth={3} />
        </div>
        <h3 className="text-xl font-black uppercase mb-2">
          No Wallet Connected
        </h3>
        <p className="text-sm font-medium text-[#0A0A0F]/60 mb-4">
          Connect your Neo wallet to get started
        </p>
        <NeoWalletButton />
      </div>
    );
  }

  return (
    <div className="
      p-6
      bg-white
      border-4 border-[#0A0A0F]
      rounded-[32px]
      shadow-[8px_8px_0px_0px_rgba(10,10,15,1)]
    ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black uppercase">Your Wallet</h3>
        <div className="
          px-3 py-1
          bg-[#00E599]
          border-2 border-[#0A0A0F]
          rounded-[12px]
          text-xs font-bold
          uppercase
        ">
          ✓ Connected
        </div>
      </div>

      {/* Wallet Name */}
      {wallet.connectedWallet && (
        <div className="mb-4 text-sm font-bold text-[#0A0A0F]/60">
          Using: {wallet.connectedWallet.name}
        </div>
      )}

      {/* Balances */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="
          p-4
          bg-[#00E599]/10
          border-3 border-[#00E599]
          rounded-[20px]
        ">
          <div className="text-xs font-bold text-[#0A0A0F]/60 uppercase mb-1">
            GAS Balance
          </div>
          <div className="text-2xl font-black text-[#0A0A0F]">
            {loading ? (
              <span className="animate-pulse">...</span>
            ) : error ? (
              <span className="text-[#FF5252] text-sm">Error</span>
            ) : (
              `${parseFloat(balances.gas).toFixed(4)} GAS`
            )}
          </div>
        </div>
        <div className="
          p-4
          bg-[#4FFFB0]/10
          border-3 border-[#4FFFB0]
          rounded-[20px]
        ">
          <div className="text-xs font-bold text-[#0A0A0F]/60 uppercase mb-1">
            NEO Balance
          </div>
          <div className="text-2xl font-black text-[#0A0A0F]">
            {loading ? (
              <span className="animate-pulse">...</span>
            ) : error ? (
              <span className="text-[#FF5252] text-sm">Error</span>
            ) : (
              `${balances.neo} NEO`
            )}
          </div>
        </div>
      </div>

      {/* Last Update */}
      {lastUpdate && (
        <div className="mb-4 text-xs font-medium text-[#0A0A0F]/40 text-center">
          Updated: {lastUpdate.toLocaleTimeString()}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-[#FF5252]/10 border-2 border-[#FF5252] rounded-[16px] text-xs font-bold text-[#FF5252]">
          {error}
        </div>
      )}

      {/* Address */}
      <div className="
        mb-4
        p-4
        bg-[#F5F5F5]
        border-3 border-[#0A0A0F]
        rounded-[20px]
      ">
        <div className="text-xs font-bold text-[#0A0A0F]/60 uppercase mb-2">
          Address
        </div>
        <div className="font-mono text-xs break-all leading-relaxed">
          {wallet.address}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={`https://explorer.onegate.space/address/${wallet.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex-1
            flex items-center justify-center gap-2
            px-4 py-3
            bg-[#0A0A0F]
            text-white
            border-4 border-[#0A0A0F]
            rounded-[20px]
            font-bold text-sm
            uppercase
            shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]
            hover:bg-[#B084FF]
            active:translate-x-[2px] active:translate-y-[2px]
            active:shadow-none
            transition-all duration-150
          "
        >
          <ExternalLink size={16} strokeWidth={3} />
          Explorer
        </a>
        <button
          onClick={() => navigator.clipboard.writeText(wallet.address)}
          className="
            flex-1
            flex items-center justify-center gap-2
            px-4 py-3
            bg-white
            text-[#0A0A0F]
            border-4 border-[#0A0A0F]
            rounded-[20px]
            font-bold text-sm
            uppercase
            shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]
            hover:bg-[#F5F5F5]
            active:translate-x-[2px] active:translate-y-[2px]
            active:shadow-none
            transition-all duration-150
          "
        >
          <Copy size={16} strokeWidth={3} />
          Copy
        </button>
      </div>

      {/* Refresh Button */}
      <button
        onClick={refresh}
        disabled={loading}
        className="
          w-full mt-4
          px-4 py-3
          bg-[#00E599]
          text-[#0A0A0F]
          border-4 border-[#0A0A0F]
          rounded-[20px]
          font-bold text-sm
          uppercase
          shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]
          hover:bg-[#FFD93D]
          active:translate-x-[2px] active:translate-y-[2px]
          active:shadow-none
          transition-all duration-150
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
      >
        <RefreshCw size={16} strokeWidth={3} className={loading ? 'animate-spin' : ''} />
        {loading ? 'Refreshing...' : 'Refresh Balances'}
      </button>
    </div>
  );
}
