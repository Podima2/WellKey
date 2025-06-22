import React from 'react';
import { TrendingUp, Lock, CheckCircle, Clock, Activity } from 'lucide-react';
import { Commitment } from '../../types';

interface StatsPanelProps {
  commitments: Commitment[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ commitments }) => {
  const stats = [
    {
      label: 'TOTAL COMMITMENTS',
      value: commitments.length,
      icon: Activity,
      color: 'text-neutral-300'
    },
    {
      label: 'REVEALED',
      value: commitments.filter(c => c.status === 'revealed').length,
      icon: CheckCircle,
      color: 'text-green-400'
    },
    {
      label: 'PENDING',
      value: commitments.filter(c => c.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-400'
    },
    {
      label: 'SUCCESS RATE',
      value: commitments.length > 0 ? Math.round((commitments.filter(c => c.status === 'revealed').length / commitments.length) * 100) : 0,
      icon: TrendingUp,
      color: 'text-neutral-300',
      suffix: '%'
    }
  ];

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl">
          <TrendingUp className="w-5 h-5 text-neutral-300" />
        </div>
        <div>
          <h3 className="text-lg text-sharp text-white">PROTOCOL STATS</h3>
          <p className="text-sm text-neutral-400 font-medium">Your commitment activity</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:bg-neutral-800 hover:border-neutral-700 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div className="text-2xl font-mono font-bold text-white">
                  {stat.value}{stat.suffix || ''}
                </div>
              </div>
              <div className="text-xs text-neutral-400 font-bold tracking-wide">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};