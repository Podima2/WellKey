import React, { useState } from 'react';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';

export const WalletButton: React.FC = () => {
  const { 
    address, 
    balance, 
    isConnected, 
    isConnecting, 
    error, 
    connectWallet, 
    disconnectWallet, 
    formatAddress, 
    formatBalance 
  } = useWallet();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openEtherscan = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="flex items-center space-x-2 bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 disabled:from-neutral-900 disabled:to-neutral-900 text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-neutral-500/10 disabled:cursor-not-allowed disabled:hover:scale-100 tracking-wide text-sm"
        >
          <Wallet className="w-4 h-4" />
          <span>
            {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
          </span>
        </button>
        
        {error && (
          <div className="absolute top-full mt-2 right-0 bg-red-950 border border-red-800 text-red-300 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap z-50 animate-scale-in">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 text-white px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm font-semibold tracking-wide"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <Wallet className="w-4 h-4" />
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-left">
            <div className="font-semibold">
              {formatAddress(address!)}
            </div>
            <div className="text-xs text-neutral-400 font-medium -mt-0.5">
              {formatBalance(balance!)} ETH
            </div>
          </div>
          
          <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
            showDropdown ? 'rotate-180' : ''
          }`} />
        </div>
      </button>

      {showDropdown && (
        <div className="absolute top-full mt-2 right-0 bg-neutral-950 border border-neutral-800 rounded-xl p-2 min-w-[240px] z-50 animate-scale-in shadow-xl">
          <div className="px-3 py-2 border-b border-neutral-800 mb-2">
            <div className="text-sm font-semibold text-white mb-1">Wallet Connected</div>
            <div className="text-xs text-neutral-400 font-mono break-all">
              {address}
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              Balance: {formatBalance(balance!)} ETH
            </div>
          </div>
          
          <div className="space-y-1">
            <button
              onClick={copyAddress}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors font-medium hover:scale-[1.01] active:scale-[0.99]"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Copy Address'}</span>
            </button>
            
            <button
              onClick={openEtherscan}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors font-medium hover:scale-[1.01] active:scale-[0.99]"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on Etherscan</span>
            </button>
            
            <div className="border-t border-neutral-800 my-1"></div>
            
            <button
              onClick={() => {
                disconnectWallet();
                setShowDropdown(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition-colors font-medium hover:scale-[1.01] active:scale-[0.99]"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};