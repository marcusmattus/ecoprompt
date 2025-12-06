import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { rpc, sc, u } from '@cityofzion/neon-js';

/**
 * NEO BALANCE HOOK
 * Fetches real NEO and GAS balances from Neo N3 blockchain
 */

// Neo N3 MainNet RPC endpoints (fallback array)
const RPC_ENDPOINTS = [
  'https://mainnet1.neo.coz.io:443',
  'https://mainnet2.neo.coz.io:443',
  'https://n3seed1.ngd.network:10332',
  'https://n3seed2.ngd.network:10332'
];

// Contract hashes for Neo N3
const NEO_CONTRACT = '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5';
const GAS_CONTRACT = '0xd2a4cff31913016155e38e474a2c06d08be276cf';

export const useNeoBalance = () => {
  const wallet = useWallet();
  const [balances, setBalances] = useState({
    neo: '0',
    gas: '0.00000000',
    gasNumeric: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  /**
   * Get working RPC client
   */
  const getRPCClient = useCallback(async () => {
    // Try each endpoint until one works
    for (const endpoint of RPC_ENDPOINTS) {
      try {
        const client = new rpc.RPCClient(endpoint);
        // Test the connection
        await client.getBlockCount();
        return client;
      } catch (err) {
        console.warn(`RPC endpoint ${endpoint} failed:`, err.message);
        continue;
      }
    }
    throw new Error('All RPC endpoints failed');
  }, []);

  /**
   * Fetch NEO balance
   */
  const fetchNeoBalance = useCallback(async (client, address) => {
    try {
      const result = await client.execute(
        new rpc.Query({
          method: 'invokefunction',
          params: [
            NEO_CONTRACT,
            'balanceOf',
            [{ type: 'Hash160', value: sc.ContractParam.hash160(address).toJson().value }]
          ]
        })
      );

      if (result.state === 'HALT' && result.stack && result.stack.length > 0) {
        const balance = result.stack[0].value;
        return balance || '0';
      }
      return '0';
    } catch (err) {
      console.error('Failed to fetch NEO balance:', err);
      return '0';
    }
  }, []);

  /**
   * Fetch GAS balance
   */
  const fetchGasBalance = useCallback(async (client, address) => {
    try {
      const result = await client.execute(
        new rpc.Query({
          method: 'invokefunction',
          params: [
            GAS_CONTRACT,
            'balanceOf',
            [{ type: 'Hash160', value: sc.ContractParam.hash160(address).toJson().value }]
          ]
        })
      );

      if (result.state === 'HALT' && result.stack && result.stack.length > 0) {
        const balance = result.stack[0].value;
        // GAS has 8 decimals
        const gasValue = parseInt(balance || '0') / 100000000;
        return {
          formatted: gasValue.toFixed(8),
          numeric: gasValue
        };
      }
      return { formatted: '0.00000000', numeric: 0 };
    } catch (err) {
      console.error('Failed to fetch GAS balance:', err);
      return { formatted: '0.00000000', numeric: 0 };
    }
  }, []);

  /**
   * Fetch all balances
   */
  const fetchBalances = useCallback(async () => {
    if (!wallet.address || !wallet.connected) {
      setBalances({ neo: '0', gas: '0.00000000', gasNumeric: 0 });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching balances for:', wallet.address);
      
      // Get working RPC client
      const client = await getRPCClient();
      
      // Convert address to script hash for queries
      const scriptHash = u.reverseHex(u.hash160(wallet.address));
      
      // Fetch both balances in parallel
      const [neoBalance, gasBalance] = await Promise.all([
        fetchNeoBalance(client, wallet.address),
        fetchGasBalance(client, wallet.address)
      ]);

      setBalances({
        neo: neoBalance.toString(),
        gas: gasBalance.formatted,
        gasNumeric: gasBalance.numeric
      });
      
      setLastUpdate(new Date());
      console.log('Balances updated:', { neo: neoBalance, gas: gasBalance.formatted });
      
    } catch (err) {
      console.error('Failed to fetch balances:', err);
      setError(err.message);
      // Keep previous balances on error
    } finally {
      setLoading(false);
    }
  }, [wallet.address, wallet.connected, getRPCClient, fetchNeoBalance, fetchGasBalance]);

  /**
   * Auto-fetch on wallet connection
   */
  useEffect(() => {
    if (wallet.connected && wallet.address) {
      fetchBalances();
      
      // Set up auto-refresh every 30 seconds
      const interval = setInterval(fetchBalances, 30000);
      
      return () => clearInterval(interval);
    } else {
      setBalances({ neo: '0', gas: '0.00000000', gasNumeric: 0 });
      setLastUpdate(null);
    }
  }, [wallet.connected, wallet.address, fetchBalances]);

  /**
   * Manual refresh
   */
  const refresh = useCallback(() => {
    fetchBalances();
  }, [fetchBalances]);

  return {
    balances,
    loading,
    error,
    lastUpdate,
    refresh,
    hasGas: balances.gasNumeric > 0,
    hasNeo: parseInt(balances.neo) > 0
  };
};

export default useNeoBalance;
