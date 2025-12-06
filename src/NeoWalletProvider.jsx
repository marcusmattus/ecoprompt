import React, { useMemo, useCallback } from 'react';
import { WalletProvider } from '@rentfuse-labs/neo-wallet-adapter-react';
import {
  getNeoLineWallet,
  getO3Wallet,
  getOneGateWallet,
} from '@rentfuse-labs/neo-wallet-adapter-wallets';

/**
 * NEO WALLET CONTEXT PROVIDER
 * Integrates with Neo N3 blockchain
 */

export default function NeoWalletProvider({ children }) {
  // Initialize Neo wallet adapters
  const wallets = useMemo(
    () => [
      getNeoLineWallet(),  // Most popular Neo wallet
      getO3Wallet(),       // Multi-chain support
      getOneGateWallet(),  // Neo ecosystem wallet
    ],
    []
  );

  // Error handler
  const onError = useCallback((error) => {
    console.error('Neo Wallet Error:', error);
    // Show user-friendly error message
    if (error.message.includes('not installed')) {
      console.warn('Wallet extension not installed');
    } else if (error.message.includes('User rejected')) {
      console.info('User rejected connection');
    } else {
      console.error('Wallet error:', error.message);
    }
  }, []);

  // Neo N3 network configuration
  const options = useMemo(() => ({
    network: 'TestNet', // Use TestNet for testing, MainNet for production
    chainId: 877933390, // Neo N3 TestNet chainId (use 860833102 for MainNet)
    rpcAddress: 'https://testnet1.neo.coz.io:443',
    // Auto-connect to previously connected wallet
    autoConnect: false,
  }), []);

  return (
    <WalletProvider 
      wallets={wallets} 
      options={options}
      onError={onError}
    >
      {children}
    </WalletProvider>
  );
}
