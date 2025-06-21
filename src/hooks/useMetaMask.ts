import { useState, useEffect, useCallback } from 'react';
import { createPublicClient, createWalletClient, custom, http, formatEther } from 'viem';
import { sepolia } from 'viem/chains';

interface MetaMaskState {
  account: string | null;
  balance: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export const useMetaMask = () => {
  const [state, setState] = useState<MetaMaskState>({
    account: null,
    balance: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setState(prev => ({ ...prev, error: 'MetaMask not installed' }));
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      });

      const [account] = await walletClient.requestAddresses();
      
      if (account) {
        const balance = await publicClient.getBalance({ address: account });
        const formattedBalance = formatEther(balance);

        setState({
          account,
          balance: formattedBalance,
          isConnected: true,
          isConnecting: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: 'Failed to connect wallet',
      }));
    }
  };

  const disconnectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) return;
    
    try {
      await window.ethereum.request({
        method: "wallet_revokePermissions",
        params: [{
          eth_accounts: {}
        }]
      });
      
      setState({
        account: null,
        balance: null,
        isConnected: false,
        isConnecting: false,
        error: null,
      });
    } catch (error) {
      console.error('Error disconnecting from MetaMask:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to disconnect'
      }));
    }
  }, [isMetaMaskInstalled]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    return num.toFixed(4);
  };

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) return;

      try {
        const walletClient = createWalletClient({
          chain: sepolia,
          transport: custom(window.ethereum),
        });

        const addresses = await walletClient.getAddresses();
        
        if (addresses.length > 0) {
          const account = addresses[0];
          const balance = await publicClient.getBalance({ address: account });
          const formattedBalance = formatEther(balance);

          setState({
            account,
            balance: formattedBalance,
            isConnected: true,
            isConnecting: false,
            error: null,
          });
        }
      } catch (error) {
        // Silently fail if not connected
        console.log('Wallet not connected');
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setState({
          account: null,
          balance: null,
          isConnected: false,
          isConnecting: false,
          error: null,
        });
      } else {
        connectWallet();
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    formatAddress,
    formatBalance,
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}