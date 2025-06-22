import React from 'react';
import { Sparkles } from 'lucide-react';
import { Logo } from '../ui/Logo';

interface EmptyStateProps {
  onCreateClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-12 text-center animate-slide-up">
      <div className="relative mb-8">
        <div className="w-24 h-24 mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center animate-float">
          <Logo size="lg" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-neutral-800 border border-neutral-700 rounded-full flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-neutral-300" />
        </div>
      </div>
      
      <h3 className="text-2xl text-sharp text-white mb-4">NO COMMITMENTS YET</h3>
      <p className="text-neutral-400 mb-8 max-w-md mx-auto leading-relaxed font-medium">
        Create your first zero-knowledge commitment to get started with cryptographic truth protocols. 
        Make predictions, store secrets, or create time-locked messages.
      </p>
      
      <div className="space-y-4">
        <button
          onClick={onCreateClick}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sharp-light tracking-wide"
        >
          <span>CREATE YOUR FIRST COMMITMENT</span>
        </button>
        
        <div className="flex items-center justify-center space-x-6 text-sm text-neutral-500">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="font-semibold tracking-wide">CRYPTOGRAPHICALLY SECURE</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="font-semibold tracking-wide">ZERO-KNOWLEDGE PROOFS</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-neutral-400 rounded-full"></div>
            <span className="font-semibold tracking-wide">TRUSTLESS VERIFICATION</span>
          </div>
        </div>
      </div>
    </div>
  );
};