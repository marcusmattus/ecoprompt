import React, { useState } from 'react';
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';
import { useNeoBalance } from './hooks/useNeoBalance';
import { useNeoTransaction } from './hooks/useNeoTransaction';
import { Send, Loader, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

/**
 * NEO TRANSACTION TEST COMPONENT
 * Demonstrates real transaction signing and sending
 */

export default function NeoTransactionTest() {
  const wallet = useWallet();
  const { balances, hasGas } = useNeoBalance();
  const { transferGAS, loading, error, txHash } = useNeoTransaction();
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState(null);

  const handleSendGAS = async (e) => {
    e.preventDefault();
    
    if (!recipient || !amount) {
      setStatus({ type: 'error', message: 'Please fill all fields' });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setStatus({ type: 'error', message: 'Invalid amount' });
      return;
    }

    if (amountNum > balances.gasNumeric) {
      setStatus({ type: 'error', message: 'Insufficient balance' });
      return;
    }

    setStatus(null);

    try {
      const result = await transferGAS({
        toAddress: recipient,
        amount: amountNum
      });

      if (result.success) {
        setStatus({ 
          type: 'success', 
          message: 'Transaction confirmed!',
          txHash: result.txHash
        });
        setRecipient('');
        setAmount('');
      } else {
        setStatus({ 
          type: 'error', 
          message: result.error || 'Transaction failed'
        });
      }
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.message || 'Transaction failed'
      });
    }
  };

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
        <h3 className="text-xl font-black uppercase mb-2">
          Transaction Test
        </h3>
        <p className="text-sm font-medium text-[#0A0A0F]/60">
          Connect your wallet to test transactions
        </p>
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
      <div className="mb-6">
        <h3 className="text-xl font-black uppercase mb-2 flex items-center gap-2">
          <Send size={24} strokeWidth={3} />
          Send GAS Test
        </h3>
        <p className="text-sm font-medium text-[#0A0A0F]/60">
          Test real Neo N3 transaction signing
        </p>
      </div>

      {/* Balance Display */}
      <div className="
        mb-6 p-4
        bg-[#00E599]/10
        border-3 border-[#00E599]
        rounded-[20px]
      ">
        <div className="text-xs font-bold text-[#0A0A0F]/60 uppercase mb-1">
          Your Balance
        </div>
        <div className="text-2xl font-black text-[#0A0A0F]">
          {parseFloat(balances.gas).toFixed(8)} GAS
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSendGAS} className="space-y-4">
        {/* Recipient Address */}
        <div>
          <label className="block mb-2 text-sm font-black uppercase tracking-wide">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="NXX..."
            className="
              w-full
              px-4 py-3
              bg-white
              border-4 border-[#0A0A0F]
              rounded-[20px]
              font-mono text-sm
              placeholder:text-[#0A0A0F]/40
              focus:outline-none
              focus:shadow-[6px_6px_0px_0px_rgba(10,10,15,1)]
              focus:-translate-y-1 focus:-translate-x-1
              transition-all duration-150
            "
            disabled={loading}
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block mb-2 text-sm font-black uppercase tracking-wide">
            Amount (GAS)
          </label>
          <input
            type="number"
            step="0.00000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="
              w-full
              px-4 py-3
              bg-white
              border-4 border-[#0A0A0F]
              rounded-[20px]
              font-mono text-lg font-bold
              placeholder:text-[#0A0A0F]/40
              focus:outline-none
              focus:shadow-[6px_6px_0px_0px_rgba(10,10,15,1)]
              focus:-translate-y-1 focus:-translate-x-1
              transition-all duration-150
            "
            disabled={loading}
          />
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex gap-2">
          {[0.01, 0.1, 1].map(val => (
            <button
              key={val}
              type="button"
              onClick={() => setAmount(val.toString())}
              disabled={loading || val > balances.gasNumeric}
              className="
                flex-1
                px-3 py-2
                bg-[#F5F5F5]
                border-3 border-[#0A0A0F]
                rounded-[16px]
                font-bold text-sm
                hover:bg-[#FFD93D]
                active:translate-x-[1px] active:translate-y-[1px]
                transition-all
                disabled:opacity-30
              "
            >
              {val} GAS
            </button>
          ))}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={loading || !hasGas || !recipient || !amount}
          className="
            w-full
            flex items-center justify-center gap-2
            px-6 py-4
            bg-[#00E599]
            text-[#0A0A0F]
            border-4 border-[#0A0A0F]
            rounded-[24px]
            font-bold text-lg
            uppercase tracking-wide
            shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]
            hover:bg-[#FFD93D]
            active:translate-x-[2px] active:translate-y-[2px]
            active:shadow-none
            transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {loading ? (
            <>
              <Loader size={20} strokeWidth={3} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={20} strokeWidth={3} />
              Send GAS
            </>
          )}
        </button>
      </form>

      {/* Status Messages */}
      {loading && (
        <div className="
          mt-4 p-4
          bg-[#FFD93D]/20
          border-3 border-[#FFD93D]
          rounded-[20px]
          flex items-center gap-3
        ">
          <Loader size={20} strokeWidth={3} className="animate-spin" />
          <div>
            <div className="font-bold text-sm">Processing Transaction...</div>
            <div className="text-xs text-[#0A0A0F]/60">
              Please confirm in your wallet and wait for blockchain confirmation
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="
          mt-4 p-4
          bg-[#FF5252]/20
          border-3 border-[#FF5252]
          rounded-[20px]
          flex items-start gap-3
        ">
          <XCircle size={20} strokeWidth={3} className="text-[#FF5252] flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm text-[#FF5252]">Transaction Failed</div>
            <div className="text-xs text-[#FF5252]/80 mt-1">
              {error}
            </div>
          </div>
        </div>
      )}

      {status?.type === 'success' && (
        <div className="
          mt-4 p-4
          bg-[#00E599]/20
          border-3 border-[#00E599]
          rounded-[20px]
        ">
          <div className="flex items-start gap-3 mb-3">
            <CheckCircle size={20} strokeWidth={3} className="text-[#00E599] flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm">Transaction Confirmed! ✅</div>
              <div className="text-xs text-[#0A0A0F]/60 mt-1">
                Your GAS has been sent successfully
              </div>
            </div>
          </div>
          
          {status.txHash && (
            <a
              href={`https://explorer.onegate.space/transactionInfo/${status.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center justify-center gap-2
                px-4 py-2
                bg-[#0A0A0F]
                text-white
                border-3 border-[#0A0A0F]
                rounded-[16px]
                font-bold text-xs
                uppercase
                hover:bg-[#B084FF]
                transition-colors
              "
            >
              <ExternalLink size={14} strokeWidth={3} />
              View on Explorer
            </a>
          )}
        </div>
      )}

      {status?.type === 'error' && (
        <div className="
          mt-4 p-4
          bg-[#FF5252]/20
          border-3 border-[#FF5252]
          rounded-[20px]
          flex items-start gap-3
        ">
          <XCircle size={20} strokeWidth={3} className="text-[#FF5252] flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm text-[#FF5252]">Error</div>
            <div className="text-xs text-[#FF5252]/80 mt-1">
              {status.message}
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="
        mt-6 p-4
        bg-[#4FFFB0]/10
        border-3 border-[#4FFFB0]
        rounded-[20px]
        text-xs
      ">
        <div className="font-bold mb-2">💡 Testing Tips</div>
        <ul className="space-y-1 text-[#0A0A0F]/70">
          <li>• Make sure you have enough GAS for the transaction + fees (~0.02 GAS)</li>
          <li>• Use TestNet first before sending real assets</li>
          <li>• Transaction takes 15-30 seconds to confirm</li>
          <li>• Double-check recipient address before sending</li>
        </ul>
      </div>
    </div>
  );
}
