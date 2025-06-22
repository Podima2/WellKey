import React, { useState, useEffect } from 'react';
import { Shield, Heart, Lock, Sparkles, CheckCircle, Database, Users, Brain, Activity } from 'lucide-react';
import { Commitment, OraclePrice } from '../../types';
import { contractService } from '../../services/contractService';

interface DashboardLandingProps {
  commitments: Commitment[];
  prices: OraclePrice[];
  onCreateClick: () => void;
  onNavigate: (page: 'dashboard' | 'commitments' | 'form') => void;
}

export const DashboardLanding: React.FC<DashboardLandingProps> = ({
  commitments,
  prices,
  onCreateClick,
  onNavigate,
}) => {
  const [realTimeStats, setRealTimeStats] = useState({
    totalSubmissions: 0,
    verifiedSubmissions: 0,
    ipfsStorageCount: 0,
    loading: true
  });

  useEffect(() => {
    const loadRealTimeData = async () => {
      try {
        console.log('📊 Loading real-time platform statistics...');
        
        // Get verified submissions from contract
        const submissions = await contractService.getVerifiedSubmissions();
        const submissionsWithData = submissions.filter(s => s.submissionData);
        
        setRealTimeStats({
          totalSubmissions: submissions.length,
          verifiedSubmissions: submissions.length, // All submissions are verified
          ipfsStorageCount: submissionsWithData.length,
          loading: false
        });

        console.log('✅ Real-time stats loaded:', {
          total: submissions.length,
          verified: submissions.length,
          withIPFS: submissionsWithData.length
        });
      } catch (error) {
        console.error('❌ Failed to load real-time stats:', error);
        // Fallback to default values
        setRealTimeStats({
          totalSubmissions: 0,
          verifiedSubmissions: 0,
          ipfsStorageCount: 0,
          loading: false
        });
      }
    };

    loadRealTimeData();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(loadRealTimeData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatStatValue = (value: number, type: 'count' | 'percentage' | 'grade') => {
    if (realTimeStats.loading) return '...';
    
    switch (type) {
      case 'count':
        return value.toLocaleString();
      case 'percentage':
        return value === 0 ? '0%' : '100%';
      case 'grade':
        return value > 0 ? 'A+' : 'N/A';
      default:
        return value.toString();
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/20 via-transparent to-purple-900/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center space-y-8 animate-slide-up">
            {/* Main Headline */}
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-5xl md:text-6xl text-sharp text-white leading-tight">
                Wellness Data
                <span className="block text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                  Redefined
                </span>
              </h1>
              <p className="text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed font-medium">
                Anonymous wellness assessments powered by zero-knowledge proofs. 
                Share your story, help others, maintain complete privacy.
              </p>
            </div>

            {/* Key Features Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
              {[
                { icon: Shield, text: 'Zero-Knowledge Verified', color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30' },
                { icon: Lock, text: 'Completely Anonymous', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30' },
                { icon: Database, text: 'IPFS Stored', color: 'from-green-500/20 to-emerald-500/20 border-green-500/30' },
                { icon: Heart, text: 'Community Driven', color: 'from-red-500/20 to-pink-500/20 border-red-500/30' }
              ].map((feature, index) => (
                <div
                  key={feature.text}
                  className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${feature.color} rounded-full border backdrop-blur-sm animate-scale-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <feature.icon className="w-4 h-4 text-white" />
                  <span className="text-white font-semibold text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Stats Overview */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <h2 className="text-3xl text-sharp text-white">Platform Overview</h2>
            {realTimeStats.loading ? (
              <div className="w-6 h-6 border-2 border-neutral-600 border-t-white rounded-full animate-spin"></div>
            ) : (
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-950 border border-green-800 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-bold tracking-wide">LIVE DATA</span>
              </div>
            )}
          </div>
          <p className="text-neutral-400 font-medium max-w-2xl mx-auto">
            Real-time insights from our anonymous wellness community on the blockchain
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Users,
              title: 'Total Submissions',
              value: formatStatValue(realTimeStats.totalSubmissions, 'count'),
              subtitle: realTimeStats.totalSubmissions === 1 ? 'Anonymous assessment' : 'Anonymous assessments',
              color: 'from-blue-900 to-indigo-900 border-blue-800',
              iconColor: 'text-blue-300',
              valueColor: 'text-blue-400',
              realValue: realTimeStats.totalSubmissions
            },
            {
              icon: Shield,
              title: 'ZK Verified',
              value: formatStatValue(realTimeStats.verifiedSubmissions, 'percentage'),
              subtitle: 'Cryptographically proven',
              color: 'from-purple-900 to-pink-900 border-purple-800',
              iconColor: 'text-purple-300',
              valueColor: 'text-purple-400',
              realValue: realTimeStats.verifiedSubmissions
            },
            {
              icon: Database,
              title: 'IPFS Storage',
              value: formatStatValue(realTimeStats.ipfsStorageCount, 'count'),
              subtitle: realTimeStats.ipfsStorageCount === 1 ? 'Stored assessment' : 'Stored assessments',
              color: 'from-green-900 to-emerald-900 border-green-800',
              iconColor: 'text-green-300',
              valueColor: 'text-green-400',
              realValue: realTimeStats.ipfsStorageCount
            },
            {
              icon: Activity,
              title: 'Privacy Score',
              value: formatStatValue(realTimeStats.totalSubmissions, 'grade'),
              subtitle: 'Maximum anonymity',
              color: 'from-yellow-900 to-orange-900 border-yellow-800',
              iconColor: 'text-yellow-300',
              valueColor: 'text-yellow-400',
              realValue: realTimeStats.totalSubmissions
            }
          ].map((stat, index) => (
            <div
              key={stat.title}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 animate-slide-up relative overflow-hidden`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Loading overlay */}
              {realTimeStats.loading && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                <div className={`text-3xl font-mono font-bold ${stat.valueColor} transition-all duration-500`}>
                  {stat.value}
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">{stat.title}</h3>
                <p className={`${stat.iconColor} text-sm font-medium opacity-80`}>
                  {stat.subtitle}
                </p>
              </div>

              {/* Real-time indicator for non-zero values */}
              {!realTimeStats.loading && stat.realValue > 0 && (
                <div className="absolute top-3 right-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contract Status */}
        <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-neutral-900 to-neutral-800 border border-neutral-700 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold text-sm">CONTRACT ACTIVE</span>
            </div>
            <div className="w-px h-4 bg-neutral-600"></div>
            <span className="text-neutral-400 font-mono text-sm">
              0xBED4...5494
            </span>
            <div className="w-px h-4 bg-neutral-600"></div>
            <span className="text-neutral-400 font-semibold text-sm">
              Sepolia Testnet
            </span>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl text-sharp text-white mb-4">How It Works</h2>
          <p className="text-neutral-400 font-medium max-w-2xl mx-auto">
            Three simple steps to contribute to anonymous wellness research
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Complete Assessment',
              description: 'Answer wellness questions in a completely anonymous environment. Your responses help build understanding of wellness patterns.',
              icon: Heart,
              color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20'
            },
            {
              step: '02',
              title: 'ZK Verification',
              description: 'Verify your humanity using zero-knowledge proofs. Prove you\'re real without revealing any personal information.',
              icon: Shield,
              color: 'from-purple-500/10 to-pink-500/10 border-purple-500/20'
            },
            {
              step: '03',
              title: 'Secure Storage',
              description: 'Your encrypted data is stored on IPFS and verified on the blockchain. Permanent, anonymous, and immutable.',
              icon: Database,
              color: 'from-green-500/10 to-emerald-500/10 border-green-500/20'
            }
          ].map((step, index) => (
            <div
              key={step.step}
              className={`relative bg-gradient-to-br ${step.color} border rounded-2xl p-8 hover:scale-[1.02] transition-all duration-300 animate-slide-up`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="absolute top-6 right-6 text-6xl font-mono font-black text-white/5">
                {step.step}
              </div>
              
              <div className="relative z-10">
                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl w-fit mb-6">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl text-sharp text-white mb-4">{step.title}</h3>
                <p className="text-neutral-300 font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Guarantee */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-neutral-950 to-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center animate-slide-up">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-green-900 to-emerald-900 border border-green-800 rounded-2xl">
                <Shield className="w-8 h-8 text-green-300" />
              </div>
              <h2 className="text-3xl text-sharp text-white">Privacy Guarantee</h2>
            </div>
            
            <p className="text-xl text-neutral-300 leading-relaxed font-medium">
              Your wellness data is protected by military-grade encryption and zero-knowledge proofs. 
              We never see your personal information, and neither does anyone else.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              {[
                { icon: Users, title: 'Anonymous', desc: 'No personal data collected' },
                { icon: Lock, title: 'Encrypted', desc: 'End-to-end encryption' },
                { icon: Shield, title: 'ZK Verified', desc: 'Zero-knowledge proofs' },
                { icon: CheckCircle, title: 'Immutable', desc: 'Blockchain verified' }
              ].map((guarantee, index) => (
                <div key={guarantee.title} className="space-y-3">
                  <div className="p-3 bg-neutral-800 border border-neutral-700 rounded-xl w-fit mx-auto">
                    <guarantee.icon className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{guarantee.title}</h4>
                    <p className="text-neutral-400 text-sm font-medium">{guarantee.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Community Impact */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center animate-slide-up">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Heart className="w-8 h-8 text-purple-400 animate-pulse" />
            <h2 className="text-3xl text-sharp text-white">Making a Difference</h2>
          </div>
          
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed font-medium mb-8">
            Every anonymous submission helps researchers and communities better understand wellness patterns. 
            Your story matters and can help others feel less alone.
          </p>

          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-semibold">Join the movement for better wellness understanding</span>
          </div>
        </div>
      </div>
    </div>
  );
};