import React, { useState } from 'react';
import { Shield, Eye, EyeOff, ExternalLink, Copy, Calendar, User, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { VerifiedSubmission } from '../../services/contractService';

interface SubmissionCardProps {
  submission: VerifiedSubmission;
}

export const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const getFormDataSummary = () => {
    if (!submission.submissionData?.formData) return null;

    const { formData } = submission.submissionData;
    return {
      age: formData.age,
      mood: formData.currentMood,
      sleep: formData.sleepQuality,
      stress: formData.stressLevel,
      exercise: formData.exerciseFrequency,
      diet: formData.dietPreference,
      sensitiveAnswers: [
        formData.selfHarm,
        formData.masturbation,
        formData.drugUse?.length > 0 ? `${formData.drugUse.length} substances` : null,
        formData.sexualPartners,
        formData.abuseHistory,
        formData.crimeHistory
      ].filter(Boolean).length
    };
  };

  const summary = getFormDataSummary();

  return (
    <div className="group relative overflow-hidden bg-neutral-950 border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-300 animate-slide-up">
      {/* Verified gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h4 className="text-lg font-bold text-white tracking-tight">{submission.description}</h4>
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-950 border border-green-800 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-400 font-bold tracking-wide">VERIFIED</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-neutral-400 mb-2">
              <Shield className="w-4 h-4" />
              <span className="font-medium">ZK Passport Verified Submission</span>
            </div>
            
            <div className="text-xs text-neutral-500 font-medium">
              Verified {formatTimeAgo(submission.verifiedAt)}
              {submission.submissionData?.metadata?.submissionId && (
                <span className="ml-3">
                  • ID: {submission.submissionData.metadata.submissionId}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* IPFS Hash */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-neutral-400 tracking-wide">IPFS Hash</label>
              <button
                onClick={() => copyToClipboard(submission.ipfsHash)}
                className="flex items-center space-x-1 text-xs text-neutral-400 hover:text-neutral-300 transition-colors font-medium hover:scale-105 active:scale-95"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 font-mono text-sm text-neutral-300 break-all hover:bg-neutral-800 hover:border-neutral-700 transition-colors">
              {submission.ipfsHash}
            </div>
          </div>

          {/* Data Summary */}
          {summary && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-neutral-400 tracking-wide">Assessment Summary</label>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center space-x-1 text-xs text-neutral-400 hover:text-neutral-300 transition-colors font-medium hover:scale-105 active:scale-95"
                >
                  {showDetails ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showDetails ? 'Hide' : 'Show'} Details</span>
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-green-950 to-emerald-950 border border-green-800 rounded-xl p-4">
                {!showDetails ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-300">{summary.age || 'N/A'}</div>
                      <div className="text-xs text-green-400 font-semibold">AGE RANGE</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-300 capitalize">{summary.mood || 'N/A'}</div>
                      <div className="text-xs text-green-400 font-semibold">MOOD</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-300 capitalize">{summary.stress || 'N/A'}</div>
                      <div className="text-xs text-green-400 font-semibold">STRESS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-300">{summary.sensitiveAnswers}</div>
                      <div className="text-xs text-green-400 font-semibold">RESPONSES</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-green-400 font-semibold">Age Range:</span>
                          <span className="text-green-300">{summary.age || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-400 font-semibold">Current Mood:</span>
                          <span className="text-green-300 capitalize">{summary.mood || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-400 font-semibold">Sleep Quality:</span>
                          <span className="text-green-300 capitalize">{summary.sleep || 'Not specified'}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-green-400 font-semibold">Stress Level:</span>
                          <span className="text-green-300 capitalize">{summary.stress || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-400 font-semibold">Exercise:</span>
                          <span className="text-green-300 capitalize">{summary.exercise || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-400 font-semibold">Diet:</span>
                          <span className="text-green-300 capitalize">{summary.diet || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-green-800">
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 font-semibold">Sensitive Questions Answered:</span>
                        <span className="text-green-300 font-bold">{summary.sensitiveAnswers} responses</span>
                      </div>
                      <div className="text-xs text-green-400 mt-1 opacity-75">
                        Anonymous responses help build understanding of wellness patterns
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-3 pt-4 border-t border-neutral-800">
            <a
              href={`https://gateway.pinata.cloud/ipfs/${submission.ipfsHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98] text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on IPFS</span>
            </a>
            
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-950 border border-green-800 rounded-xl">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-semibold text-sm">ZK Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};