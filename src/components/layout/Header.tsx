import React from 'react';
import { Home, List, FileText } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { WalletButton } from '../wallet/WalletButton';

interface HeaderProps {
  currentPage: 'dashboard' | 'commitments' | 'form';
  onNavigate: (page: 'dashboard' | 'commitments' | 'form') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-xl">
                <Logo size="md" />
              </div>
              <div>
                <h1 className="text-xl brand-text text-white">
                  WELLKEY
                </h1>
                <p className="brand-subtitle text-neutral-500">CRYPTOGRAPHIC TRUTH</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-1 bg-neutral-950 border border-neutral-800 rounded-xl p-1">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ease-out ${
                  currentPage === 'dashboard'
                    ? 'bg-neutral-800 text-white shadow-lg transform scale-[1.02]'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 hover:scale-[1.01]'
                }`}
              >
                <Home className={`w-4 h-4 transition-all duration-300 ${
                  currentPage === 'dashboard' ? 'text-white' : 'text-neutral-400'
                }`} />
                <span className="transition-all duration-300">DASHBOARD</span>
                {currentPage === 'dashboard' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-700/20 to-neutral-600/20 rounded-xl animate-pulse" />
                )}
              </button>
              <button
                onClick={() => onNavigate('commitments')}
                className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ease-out ${
                  currentPage === 'commitments'
                    ? 'bg-neutral-800 text-white shadow-lg transform scale-[1.02]'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 hover:scale-[1.01]'
                }`}
              >
                <List className={`w-4 h-4 transition-all duration-300 ${
                  currentPage === 'commitments' ? 'text-white' : 'text-neutral-400'
                }`} />
                <span className="transition-all duration-300">COMMITMENTS</span>
                {currentPage === 'commitments' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-700/20 to-neutral-600/20 rounded-xl animate-pulse" />
                )}
              </button>
              <button
                onClick={() => onNavigate('form')}
                className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ease-out ${
                  currentPage === 'form'
                    ? 'bg-neutral-800 text-white shadow-lg transform scale-[1.02]'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50 hover:scale-[1.01]'
                }`}
              >
                <FileText className={`w-4 h-4 transition-all duration-300 ${
                  currentPage === 'form' ? 'text-white' : 'text-neutral-400'
                }`} />
                <span className="transition-all duration-300">FORM</span>
                {currentPage === 'form' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-700/20 to-neutral-600/20 rounded-xl animate-pulse" />
                )}
              </button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <WalletButton />
          </div>
        </div>
      </div>
    </header>
  );
};