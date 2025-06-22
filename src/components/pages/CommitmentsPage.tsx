import React, { useState } from 'react';
import { SubmissionsSection } from '../submissions/SubmissionsSection';
import { RefreshCw, Database } from 'lucide-react';
import { Commitment, CommitmentCondition, OraclePrice } from '../../types';

interface CommitmentsPageProps {
  commitments: Commitment[];
  prices: OraclePrice[];
  onCreateCommitment: (secret: string, description: string, condition: CommitmentCondition) => void;
  onReveal: (id: string, secret: string) => void;
  onNavigate: (page: 'dashboard' | 'commitments') => void;
}

export const CommitmentsPage: React.FC<CommitmentsPageProps> = ({
  commitments,
  prices,
  onCreateCommitment,
  onReveal,
}) => {
  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slide-up">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl text-sharp text-white mb-2">VERIFIED SUBMISSIONS</h1>
          <p className="text-neutral-400 font-medium">
            Anonymous wellness assessments from the blockchain
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-950 to-emerald-950 border border-green-800 rounded-xl">
            <Database className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-bold text-sm tracking-wide">BLOCKCHAIN VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Submissions Content */}
      <SubmissionsSection />
    </main>
  );
};