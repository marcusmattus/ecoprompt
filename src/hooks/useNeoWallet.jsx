import { useState, useEffect, createContext, useContext } from 'react';

const NeoWalletContext = createContext(null);

export const NeoWalletProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('0');
  const [network, setNetwork] = useState('TestNet');
  const [walletType, setWalletType] = useState(null);

  // Check for saved wallet on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('neo_wallet_type');
    const savedAddress = localStorage.getItem('neo_wallet_address');
    if (savedWallet && savedAddress) {
      reconnectWallet(savedWallet, savedAddress);
    }
  }, []);

  const reconnectWallet = async (type, addr) => {
    setWalletType(type);
    setAddress(addr);
    setConnected(true);
    await fetchBalance(addr);
  };

  const connect = async (type) => {
    setConnecting(true);
    try {
      if (type === 'neoline') {
        await connectNeoLine();
      } else if (type === 'o3') {
        await connectO3();
      } else if (type === 'onegate') {
        await connectOneGate();
      } else if (type === 'walletconnect') {
        await connectWalletConnect();
      }
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    } finally {
      setConnecting(false);
    }
  };

  const connectNeoLine = async () => {
    if (typeof window.NEOLine === 'undefined') {
      throw new Error('NeoLine wallet not installed. Please install from https://neoline.io');
    }

    const neoline = new window.NEOLine.Init();
    const account = await neoline.getAccount();
    
    setAddress(account.address);
    setNetwork(account.label);
    setWalletType('neoline');
    setConnected(true);

    localStorage.setItem('neo_wallet_type', 'neoline');
    localStorage.setItem('neo_wallet_address', account.address);

    await fetchBalance(account.address);
  };

  const connectO3 = async () => {
    if (typeof window.o3dapi === 'undefined') {
      throw new Error('O3 wallet not installed. Please install from https://o3.network');
    }

    await window.o3dapi.NEO.enable();
    const account = await window.o3dapi.NEO.getAccount();
    
    setAddress(account.address);
    setNetwork(account.network);
    setWalletType('o3');
    setConnected(true);

    localStorage.setItem('neo_wallet_type', 'o3');
    localStorage.setItem('neo_wallet_address', account.address);

    await fetchBalance(account.address);
  };

  const connectOneGate = async () => {
    if (typeof window.OneGate === 'undefined') {
      throw new Error('OneGate wallet not installed. Please install from https://onegate.space');
    }

    const account = await window.OneGate.getAccount();
    
    setAddress(account.address);
    setNetwork(account.network);
    setWalletType('onegate');
    setConnected(true);

    localStorage.setItem('neo_wallet_type', 'onegate');
    localStorage.setItem('neo_wallet_address', account.address);

    await fetchBalance(account.address);
  };

  const connectWalletConnect = async () => {
    // WalletConnect implementation would go here
    throw new Error('WalletConnect support coming soon!');
  };

  const fetchBalance = async (addr) => {
    try {
      // Fetch from Neo RPC
      const response = await fetch('https://testnet1.neo.coz.io:443', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'getnep17balances',
          params: [addr],
          id: 1
        })
      });

      const data = await response.json();
      
      // Find GAS balance
      const gasToken = data.result?.balance?.find(
        b => b.assethash === '0xd2a4cff31913016155e38e474a2c06d08be276cf'
      );

      if (gasToken) {
        const gasAmount = parseInt(gasToken.amount) / 1e8;
        setBalance(gasAmount.toFixed(4));
      } else {
        setBalance('0.0000');
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setBalance('0.0000');
    }
  };

  const disconnect = () => {
    setConnected(false);
    setAddress('');
    setBalance('0');
    setWalletType(null);
    localStorage.removeItem('neo_wallet_type');
    localStorage.removeItem('neo_wallet_address');
  };

  const signTransaction = async (transaction) => {
    if (!connected) throw new Error('Wallet not connected');

    try {
      if (walletType === 'neoline') {
        const neoline = new window.NEOLine.Init();
        return await neoline.invoke(transaction);
      } else if (walletType === 'o3') {
        return await window.o3dapi.NEO.invoke(transaction);
      } else if (walletType === 'onegate') {
        return await window.OneGate.invoke(transaction);
      }
    } catch (error) {
      console.error('Transaction signing failed:', error);
      throw error;
    }
  };

  const signMessage = async (message) => {
    if (!connected) throw new Error('Wallet not connected');

    try {
      if (walletType === 'neoline') {
        const neoline = new window.NEOLine.Init();
        return await neoline.signMessage({ message });
      } else if (walletType === 'o3') {
        return await window.o3dapi.NEO.signMessage({ message });
      } else if (walletType === 'onegate') {
        return await window.OneGate.signMessage(message);
      }
    } catch (error) {
      console.error('Message signing failed:', error);
      throw error;
    }
  };

  const value = {
    connected,
    connecting,
    address,
    balance,
    network,
    walletType,
    connect,
    disconnect,
    signTransaction,
    signMessage,
    refreshBalance: () => fetchBalance(address)
  };

  return (
    <NeoWalletContext.Provider value={value}>
      {children}
    </NeoWalletContext.Provider>
  );
};

export const useNeoWallet = () => {
  const context = useContext(NeoWalletContext);
  if (!context) {
    throw new Error('useNeoWallet must be used within NeoWalletProvider');
  }
  return context;
};
