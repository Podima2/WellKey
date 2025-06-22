import React, { useState, useEffect } from 'react';
import { SubmissionCard } from './SubmissionCard';
import { contractService, VerifiedSubmission } from '../../services/contractService';
import { Shield, RefreshCw, Database, AlertCircle, CheckCircle, ExternalLink, Copy } from 'lucide-react';

export const SubmissionsSection: React.FC = () => {
  const [submissions, setSubmissions] = useState<VerifiedSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [copied, setCopied] = useState(false);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading verified submissions from contract...');
      
      const verifiedSubmissions = await contractService.getVerifiedSubmissions();
      setSubmissions(verifiedSubmissions);
      setLastRefresh(new Date());
      
      console.log(`✅ Loaded ${verifiedSubmissions.length} verified submissions`);
    } catch (err) {
      console.error('❌ Failed to load submissions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleRefresh = () => {
    loadSubmissions();
  };

  const copyAddress = () => {
    navigator.clipboard.writeText('0xBED4db246f831E986EC1060d90fC51BD29005494');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-12 text-center animate-pulse">
          <div className="w-16 h-16 mx-auto bg-neutral-800 rounded-2xl flex items-center justify-center mb-6">
            <RefreshCw className="w-8 h-8 text-neutral-400 animate-spin" />
          </div>
          <h3 className="text-xl text-sharp text-white mb-4">Loading Submissions...</h3>
          <p className="text-neutral-400 font-medium">
            Fetching wellness assessments from the blockchain contract
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sharp-light tracking-wide shadow-lg hover:shadow-neutral-500/10"
          >
            <RefreshCw className="w-5 h-5" />
            <span>RETRY</span>
          </button>
        </div>

        <div className="bg-gradient-to-r from-red-950 to-pink-950 border border-red-800 rounded-2xl p-12 text-center animate-scale-in">
          <div className="w-16 h-16 mx-auto bg-red-900 border border-red-800 rounded-2xl flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl text-sharp text-white mb-4">Failed to Load Submissions</h3>
          <p className="text-red-300 font-medium mb-6 max-w-md mx-auto">
            {error}
          </p>
          <button
            onClick={handleRefresh}
            className="bg-gradient-to-r from-red-700 to-pink-700 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] tracking-wide"
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-neutral-400 font-medium">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
            <div className="text-xs text-neutral-500">
              {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide shadow-lg hover:shadow-neutral-500/10"
          >
            <RefreshCw className="w-4 h-4" />
            <span>REFRESH</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      {submissions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up">
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-center hover:bg-neutral-900 transition-all duration-300">
            <div className="text-2xl font-mono font-bold text-white mb-1">{submissions.length}</div>
            <div className="text-sm text-neutral-400 font-bold tracking-wide">TOTAL VERIFIED</div>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-center hover:bg-neutral-900 transition-all duration-300">
            <div className="text-2xl font-mono font-bold text-green-400 mb-1">
              {submissions.filter(s => s.submissionData).length}
            </div>
            <div className="text-sm text-neutral-400 font-bold tracking-wide">WITH IPFS DATA</div>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-center hover:bg-neutral-900 transition-all duration-300">
            <div className="text-2xl font-mono font-bold text-blue-400 mb-1">100%</div>
            <div className="text-sm text-neutral-400 font-bold tracking-wide">ANONYMOUS</div>
          </div>
        </div>
      )}

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-12 text-center animate-scale-in">
          <div className="w-24 h-24 mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center mb-6 animate-float">
            <Database className="w-12 h-12 text-neutral-400" />
          </div>
          <h3 className="text-2xl text-sharp text-white mb-4">NO SUBMISSIONS FOUND</h3>
          <p className="text-neutral-400 mb-8 max-w-md mx-auto leading-relaxed font-medium">
            No wellness assessments have been submitted yet. 
            Submissions will appear here once users complete the verification process.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-neutral-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="font-semibold tracking-wide">CRYPTOGRAPHICALLY VERIFIED</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="font-semibold tracking-wide">IPFS STORED</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neutral-400 rounded-full"></div>
              <span className="font-semibold tracking-wide">ANONYMOUS</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {submissions.map((submission, index) => (
            <div
              key={submission.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-slide-up"
            >
              <SubmissionCard submission={submission} />
            </div>
          ))}
        </div>
      )}

      {/* Contract Information - Improved Layout */}
      <div className="bg-gradient-to-r from-blue-950 to-purple-950 border border-blue-800 rounded-2xl p-8 animate-slide-up">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-blue-900 border border-blue-800 rounded-xl">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h4 className="text-xl text-sharp text-white">Contract Information</h4>
            <p className="text-blue-300 text-sm font-medium">Blockchain verification details</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contract Address */}
          <div className="space-y-3">
            <div className="text-blue-400 font-bold text-sm tracking-wide">CONTRACT ADDRESS</div>
            <div className="bg-blue-900/50 border border-blue-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="font-mono text-blue-300 text-sm break-all">
                  0xBED4db246f831E986EC1060d90fC51BD29005494
                </div>
                <button
                  onClick={copyAddress}
                  className="ml-3 flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Network Info */}
          <div className="space-y-3">
            <div className="text-blue-400 font-bold text-sm tracking-wide">NETWORK</div>
            <div className="bg-blue-900/50 border border-blue-800 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <div>
                  <div className="text-blue-300 font-semibold">Ethereum Sepolia Testnet</div>
                  <div className="text-blue-400 text-xs font-medium">Chain ID: 11155111</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-blue-800">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-blue-300 font-semibold text-sm mb-1">Immutable Storage</div>
              <div className="text-blue-400 text-sm leading-relaxed">
                All submissions are cryptographically verified and stored immutably on IPFS
              </div>
            </div>
          </div>
        </div>

        {/* External Links */}
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`https://sepolia.etherscan.io/address/0xBED4db246f831E986EC1060d90fC51BD29005494`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-900/50 hover:bg-blue-800/50 border border-blue-800 hover:border-blue-700 text-blue-300 hover:text-blue-200 rounded-xl transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98] text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View on Etherscan</span>
          </a>
          
          <a
            href="https://ipfs.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-900/50 hover:bg-blue-800/50 border border-blue-800 hover:border-blue-700 text-blue-300 hover:text-blue-200 rounded-xl transition-all duration-200 font-medium hover:scale-[1.02] active:scale-[0.98] text-sm"
          >
            <Database className="w-4 h-4" />
            <span>Learn about IPFS</span>
          </a>
        </div>
      </div>
    </div>
  );
};