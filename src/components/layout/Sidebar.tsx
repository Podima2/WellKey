import React from 'react';
import { OraclePrices } from '../oracle/OraclePrices';
import { StatsPanel } from '../stats/StatsPanel';
import { QuickActions } from '../ui/QuickActions';
import { Commitment, OraclePrice } from '../../types';

interface SidebarProps {
  prices: OraclePrice[];
  commitments: Commitment[];
  onCreateClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ prices, commitments, onCreateClick }) => {
  return (
    <div className="space-y-6">
      <OraclePrices prices={prices} />
      <StatsPanel commitments={commitments} />
      <QuickActions onCreateClick={onCreateClick} />
    </div>
  );
};