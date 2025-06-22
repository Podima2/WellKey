import React from 'react';
import { CommitmentCard } from './CommitmentCard';
import { EmptyState } from './EmptyState';
import { ArrowRight } from 'lucide-react';
import { Commitment, OraclePrice } from '../../types';

interface CommitmentsSectionProps {
  commitments: Commitment[];
  prices: OraclePrice[];
  onReveal: (id: string, secret: string) => void;
  onCreateClick: () => void;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export const CommitmentsSection: React.FC<CommitmentsSectionProps> = ({
  commitments,
  prices,
  onReveal,
  onCreateClick,
  showViewAll = false,
  onViewAll,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl text-sharp text-white">
            {showViewAll ? 'RECENT COMMITMENTS' : 'YOUR COMMITMENTS'}
          </h2>
          <p className="text-neutral-400 mt-1 font-medium">Cryptographic truth protocol in action</p>
        </div>
        
        {showViewAll && onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors font-semibold text-sm tracking-wide hover:scale-105 active:scale-95"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {commitments.length === 0 ? (
        <EmptyState onCreateClick={onCreateClick} />
      ) : (
        <div className="space-y-6">
          {commitments.map((commitment, index) => (
            <div
              key={commitment.id}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CommitmentCard
                commitment={commitment}
                prices={prices}
                onReveal={onReveal}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};