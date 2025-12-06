import { useState, useCallback } from 'react';
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { rpc, sc, tx, wallet as neonWallet, u } from '@cityofzion/neon-js';

/**
 * NEO TRANSACTION HOOK
 * Handles smart contract invocations and transaction signing
 */

// RPC endpoints
const RPC_ENDPOINTS = [
  'https://mainnet1.neo.coz.io:443',
  'https://mainnet2.neo.coz.io:443',
  'https://n3seed1.ngd.network:10332'
];

// GAS contract for payments
const GAS_CONTRACT = '0xd2a4cff31913016155e38e474a2c06d08be276cf';

export const useNeoTransaction = () => {
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState(null);

  /**
   * Get working RPC client
   */
  const getRPCClient = useCallback(async () => {
    for (const endpoint of RPC_ENDPOINTS) {
      try {
        const client = new rpc.RPCClient(endpoint);
        await client.getBlockCount();
        return client;
      } catch (err) {
        console.warn(`RPC ${endpoint} failed:`, err.message);
        continue;
      }
    }
    throw new Error('All RPC endpoints unavailable');
  }, []);

  /**
   * Invoke a smart contract method
   */
  const invokeContract = useCallback(async ({
    contractHash,
    operation,
    args = [],
    signers = [],
    systemFee = 0,
    networkFee = 0
  }) => {
    if (!wallet.connected || !wallet.address) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      console.log('Invoking contract:', { contractHash, operation, args });

      // Get RPC client
      const client = await getRPCClient();

      // Build script
      const script = sc.createScript({
        scriptHash: contractHash,
        operation,
        args: args.map(arg => {
          if (typeof arg === 'string') return sc.ContractParam.string(arg);
          if (typeof arg === 'number') return sc.ContractParam.integer(arg);
          if (typeof arg === 'boolean') return sc.ContractParam.boolean(arg);
          if (arg.type === 'Hash160') return sc.ContractParam.hash160(arg.value);
          return arg;
        })
      });

      // Get current block height for valid until
      const blockCount = await client.getBlockCount();

      // Create transaction
      const transaction = new tx.Transaction({
        signers: signers.length > 0 ? signers : [
          {
            account: neonWallet.getScriptHashFromAddress(wallet.address),
            scopes: tx.WitnessScope.CalledByEntry
          }
        ],
        script,
        validUntilBlock: blockCount + 100,
        systemFee: systemFee || 10000000, // 0.1 GAS default
        networkFee: networkFee || 1000000  // 0.01 GAS default
      });

      console.log('Transaction created:', transaction);

      // Sign transaction via wallet adapter
      const signedTx = await wallet.signTransaction({
        version: transaction.version,
        nonce: transaction.nonce,
        systemFee: transaction.systemFee.toString(),
        networkFee: transaction.networkFee.toString(),
        validUntilBlock: transaction.validUntilBlock,
        script: transaction.script,
        signers: transaction.signers
      });

      console.log('Transaction signed:', signedTx);

      // Broadcast transaction
      const result = await client.sendRawTransaction(
        signedTx.serialize ? signedTx.serialize(true) : signedTx
      );

      console.log('Transaction broadcast:', result);
      setTxHash(result);

      // Wait for confirmation
      await waitForTransaction(client, result);

      setLoading(false);
      return { success: true, txHash: result };

    } catch (err) {
      console.error('Transaction error:', err);
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [wallet, getRPCClient]);

  /**
   * Transfer GAS tokens
   */
  const transferGAS = useCallback(async ({ toAddress, amount }) => {
    if (!wallet.connected || !wallet.address) {
      throw new Error('Wallet not connected');
    }

    console.log('Transferring GAS:', { from: wallet.address, to: toAddress, amount });

    return invokeContract({
      contractHash: GAS_CONTRACT,
      operation: 'transfer',
      args: [
        { type: 'Hash160', value: wallet.address },
        { type: 'Hash160', value: toAddress },
        Math.floor(amount * 100000000), // Convert to 8 decimals
        null // data parameter
      ],
      systemFee: 5000000, // 0.05 GAS
      networkFee: 1000000  // 0.01 GAS
    });
  }, [wallet, invokeContract]);

  /**
   * Wait for transaction confirmation
   */
  const waitForTransaction = async (client, txHash, maxAttempts = 30) => {
    console.log('Waiting for transaction confirmation:', txHash);
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s between checks
        
        const result = await client.getApplicationLog(txHash);
        
        if (result && result.executions && result.executions.length > 0) {
          const execution = result.executions[0];
          
          if (execution.vmstate === 'HALT') {
            console.log('✅ Transaction confirmed successfully');
            return { success: true, result };
          } else {
            console.error('❌ Transaction failed:', execution);
            throw new Error(`Transaction failed: ${execution.exception || 'Unknown error'}`);
          }
        }
      } catch (err) {
        if (i === maxAttempts - 1) {
          throw new Error('Transaction confirmation timeout');
        }
        // Continue polling
      }
    }
    
    throw new Error('Transaction confirmation timeout');
  };

  /**
   * Get transaction status
   */
  const getTransactionStatus = useCallback(async (txHash) => {
    try {
      const client = await getRPCClient();
      const result = await client.getApplicationLog(txHash);
      
      if (result && result.executions && result.executions.length > 0) {
        return {
          found: true,
          status: result.executions[0].vmstate,
          success: result.executions[0].vmstate === 'HALT'
        };
      }
      
      return { found: false };
    } catch (err) {
      return { found: false, error: err.message };
    }
  }, [getRPCClient]);

  return {
    invokeContract,
    transferGAS,
    getTransactionStatus,
    loading,
    error,
    txHash,
    isProcessing: loading
  };
};

export default useNeoTransaction;
