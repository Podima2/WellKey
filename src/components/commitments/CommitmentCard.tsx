import React, { useState } from 'react';
import { Lock, Unlock, Eye, EyeOff, Clock, DollarSign, CheckCircle, AlertCircle, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { Commitment, OraclePrice } from '../../types';

interface CommitmentCardProps {
  commitment: Commitment;
  prices: OraclePrice[];
  onReveal: (id: string, secret: string) => void;
}

export const CommitmentCard: React.FC<CommitmentCardProps> = ({ commitment, prices, onReveal }) => {
  const [showRevealForm, setShowRevealForm] = useState(false);
  const [revealSecret, setRevealSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'revealed': 
        return {
          color: 'text-green-400 bg-green-950 border-green-800',
          icon: CheckCircle,
          label: 'Revealed',
          gradient: 'from-green-500/10 to-emerald-500/10'
        };
      case 'expired': 
        return {
          color: 'text-red-400 bg-red-950 border-red-800',
          icon: AlertCircle,
          label: 'Expired',
          gradient: 'from-red-500/10 to-pink-500/10'
        };
      default: 
        return {
          color: 'text-yellow-400 bg-yellow-950 border-yellow-800',
          icon: Clock,
          label: 'Pending',
          gradient: 'from-yellow-500/10 to-orange-500/10'
        };
    }
  };

  const statusConfig = getStatusConfig(commitment.status);
  const StatusIcon = statusConfig.icon;

  const canReveal = () => {
    if (commitment.status !== 'pending') return false;
    
    switch (commitment.condition.type) {
      case 'manual':
        return true;
      case 'price':
        const oracle = prices.find(p => p.asset === commitment.condition.asset);
        return oracle && oracle.price >= (commitment.condition.target || 0);
      case 'time':
        return commitment.condition.expiry && new Date() >= commitment.condition.expiry;
      default:
        return false;
    }
  };

  const handleReveal = (e: React.FormEvent) => {
    e.preventDefault();
    onReveal(commitment.id, revealSecret);
    setShowRevealForm(false);
    setRevealSecret('');
  };

  const getConditionIcon = () => {
    switch (commitment.condition.type) {
      case 'price': return DollarSign;
      case 'time': return Clock;
      default: return Lock;
    }
  };

  const ConditionIcon = getConditionIcon();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="group relative overflow-hidden bg-neutral-950 border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-300 animate-slide-up">
      {/* Status gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${statusConfig.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h4 className="text-lg font-bold text-white tracking-tight">{commitment.description}</h4>
              {commitment.status === 'revealed' && (
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-neutral-400 mb-2">
              <ConditionIcon className="w-4 h-4" />
              <span className="font-medium">{commitment.condition.description}</span>
            </div>
            <div className="text-xs text-neutral-500 font-medium">
              Created {formatTimeAgo(commitment.createdAt)}
              {commitment.revealedAt && (
                <span className="ml-3 text-green-400">
                  • Revealed {formatTimeAgo(commitment.revealedAt)}
                </span>
              )}
            </div>
          </div>
          
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-full border text-sm font-semibold ${statusConfig.color}`}>
            <StatusIcon className="w-4 h-4" />
            <span>{statusConfig.label}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-neutral-400 tracking-wide">Commitment Hash</label>
              <button
                onClick={() => copyToClipboard(commitment.hash)}
                className="flex items-center space-x-1 text-xs text-neutral-400 hover:text-neutral-300 transition-colors font-medium hover:scale-105 active:scale-95"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 font-mono text-sm text-neutral-300 break-all hover:bg-neutral-800 hover:border-neutral-700 transition-colors">
              {commitment.hash}
            </div>
          </div>

          {commitment.status === 'revealed' && commitment.revealedSecret && (
            <div className="animate-scale-in">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-neutral-400 tracking-wide">Revealed Secret</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    className="flex items-center space-x-1 text-xs text-neutral-400 hover:text-neutral-300 transition-colors font-medium hover:scale-105 active:scale-95"
                  >
                    {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showSecret ? 'Hide' : 'Show'}</span>
                  </button>
                  <ExternalLink className="w-3 h-3 text-neutral-500" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-950 to-emerald-950 border border-green-800 rounded-xl p-4">
                <div className="text-sm text-green-300 mb-3 leading-relaxed font-medium">
                  {showSecret ? commitment.revealedSecret : '•'.repeat(Math.min(commitment.revealedSecret.length, 50))}
                </div>
                {commitment.zkProof && (
                  <div className="pt-3 border-t border-green-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400 font-semibold tracking-wide">ZK Proof Verified</span>
                    </div>
                    <div className="text-xs text-green-400 font-mono bg-green-950 p-2 rounded-lg">
                      {commitment.zkProof}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {commitment.status === 'pending' && (
          <div className="mt-6 pt-6 border-t border-neutral-800">
            {canReveal() ? (
              !showRevealForm ? (
                <button
                  onClick={() => setShowRevealForm(true)}
                  className="w-full bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-green-500/25 hover:scale-[1.02] active:scale-[0.98] tracking-tight"
                >
                  <Unlock className="w-5 h-5" />
                  <span>Reveal Secret</span>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </button>
              ) : (
                <div className="animate-scale-in">
                  <form onSubmit={handleReveal} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-400 mb-2 tracking-wide">
                        Enter Original Secret
                      </label>
                      <input
                        type="text"
                        value={revealSecret}
                        onChange={(e) => setRevealSecret(e.target.value)}
                        placeholder="Type your original secret message"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 font-medium"
                        required
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 tracking-tight hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-green-500/20"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Reveal & Prove</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRevealForm(false)}
                        className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )
            ) : (
              <div className="text-center py-6">
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 bg-neutral-800 border border-neutral-700 rounded-full">
                    <Lock className="w-6 h-6 text-neutral-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-neutral-400 font-semibold">Reveal Condition Not Met</p>
                    <p className="text-xs text-neutral-500 mt-1 font-medium">
                      {commitment.condition.type === 'price' && 
                        `Waiting for ${commitment.condition.asset} to reach $${commitment.condition.target?.toLocaleString()}`
                      }
                      {commitment.condition.type === 'time' && 
                        `Scheduled for ${commitment.condition.expiry?.toLocaleDateString()}`
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};