import React, { useState } from 'react';
import { DashboardLanding } from './DashboardLanding';
import { CreateCommitmentModal } from '../commitments/CreateCommitmentModal';
import { Commitment, CommitmentCondition, OraclePrice } from '../../types';

interface MainContentProps {
  commitments: Commitment[];
  prices: OraclePrice[];
  onCreateCommitment: (secret: string, description: string, condition: CommitmentCondition) => void;
  onReveal: (id: string, secret: string) => void;
  onNavigate: (page: 'dashboard' | 'commitments') => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  commitments,
  prices,
  onCreateCommitment,
  onReveal,
  onNavigate,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateClick = () => {
    setShowCreateModal(true);
  };

  const handleCreateCommitment = (secret: string, description: string, condition: CommitmentCondition) => {
    onCreateCommitment(secret, description, condition);
    setShowCreateModal(false);
  };

  return (
    <>
      <main className="flex-1">
        <DashboardLanding
          commitments={commitments}
          prices={prices}
          onCreateClick={handleCreateClick}
          onNavigate={onNavigate}
        />
      </main>

      {/* Create Commitment Modal */}
      {showCreateModal && (
        <CreateCommitmentModal
          onCreateCommitment={handleCreateCommitment}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </>
  );
};