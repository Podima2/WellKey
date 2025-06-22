import React, { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { useZKPassport } from '../../contexts/ZKPassportContext';
import { PersonalInfoSection } from '../forms/PersonalInfoSection';
import { LifestyleSection } from '../forms/LifestyleSection';
import { SensitiveQuestionsSection } from '../forms/SensitiveQuestionsSection';
import { ZKPassportQRCode } from '../ui/ZKPassportQRCode';
import { uploadJSONToIPFS, validateFormData, getIPFSUrl, type WellnessFormData } from '../../utils/uploadJSONToIPFS';
import { Shield, Heart, Lock, Upload, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export const WellnessForm: React.FC = () => {
  const { address, isConnected } = useWallet();
  const { 
    connect: connectZKPassport, 
    showQRCode, 
    qrCodeUrl, 
    setShowQRCode, 
    isLoading: zkLoading, 
    isConnected: zkConnected,
    status: zkStatus,
    transactionHash
  } = useZKPassport();
  
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'zkverifying' | 'complete' | 'error'>('idle');
  const [ipfsHash, setIpfsHash] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const [formData, setFormData] = useState<WellnessFormData>({
    age: '',
    currentMood: '',
    sleepQuality: '',
    stressLevel: '',
    exerciseFrequency: '',
    dietPreference: '',
    selfHarm: '',
    selfHarmRecent: '',
    masturbation: '',
    masturbationFeelings: '',
    drugUse: [],
    sexualPartners: '',
    sexualPartnersFeelings: '',
    abuseHistory: '',
    crimeHistory: '',
    crimeCaught: ''
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      setErrorMessage('Please connect your wallet first');
      return;
    }

    // Validate form data
    const validation = validateFormData(formData);
    if (!validation.isValid) {
      setErrorMessage(`Please complete all required fields: ${validation.errors.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setUploadStatus('uploading');
    setErrorMessage('');
    
    try {
      console.log('🔄 Starting wellness assessment submission...');
      
      // Step 1: Upload form data to IPFS
      const hash = await uploadJSONToIPFS(formData, address);
      setIpfsHash(hash);
      setUploadStatus('success');
      
      console.log('✅ Wellness assessment uploaded successfully!', {
        ipfsHash: hash,
        ipfsUrl: getIPFSUrl(hash)
      });

      // Step 2: Initiate ZK Passport verification with IPFS hash
      console.log('🔐 Initiating ZK Passport verification with IPFS CID...');
      setUploadStatus('zkverifying');
      
      // Wait a moment for UI update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Connect to ZK Passport with the IPFS hash
      await connectZKPassport(hash);
      
    } catch (error) {
      console.error('❌ Failed to submit wellness assessment:', error);
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle ZK Passport verification completion
  React.useEffect(() => {
    if (zkConnected && zkStatus === 'complete') {
      setUploadStatus('complete');
      console.log('🎉 ZK Passport verification completed!');
    }
  }, [zkConnected, zkStatus]);

  const handleInputChange = (field: keyof WellnessFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleDrugUseChange = (drugUse: string[]) => {
    setFormData(prev => ({
      ...prev,
      drugUse
    }));
  };

  const getSubmitButtonContent = () => {
    switch (uploadStatus) {
      case 'uploading':
        return (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <Upload className="w-5 h-5" />
            <span>UPLOADING TO IPFS...</span>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>UPLOADED TO IPFS</span>
          </>
        );
      case 'zkverifying':
        return (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <Shield className="w-5 h-5" />
            <span>ZK VERIFICATION IN PROGRESS...</span>
          </>
        );
      case 'complete':
        return (
          <>
            <Sparkles className="w-5 h-5" />
            <CheckCircle className="w-5 h-5" />
            <span>VERIFICATION COMPLETE!</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="w-5 h-5" />
            <span>RETRY SUBMISSION</span>
          </>
        );
      default:
        return (
          <>
            <Shield className="w-5 h-5" />
            <span>SUBMIT WELLNESS ASSESSMENT</span>
          </>
        );
    }
  };

  const getSubmitButtonStyle = () => {
    switch (uploadStatus) {
      case 'success':
        return 'from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600';
      case 'zkverifying':
        return 'from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600';
      case 'complete':
        return 'from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600';
      case 'error':
        return 'from-red-700 to-pink-700 hover:from-red-600 hover:to-pink-600';
      default:
        return 'from-purple-700 to-pink-700 hover:from-purple-600 hover:to-pink-600';
    }
  };

  const isSubmitDisabled = isLoading || !isConnected || zkLoading || ['success', 'zkverifying', 'complete'].includes(uploadStatus);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-900 to-pink-900 border border-purple-800 rounded-2xl">
              <Heart className="w-8 h-8 text-purple-300" />
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-900 to-indigo-900 border border-blue-800 rounded-2xl">
              <Shield className="w-8 h-8 text-blue-300" />
            </div>
            <div className="p-3 bg-gradient-to-br from-green-900 to-emerald-900 border border-green-800 rounded-2xl">
              <Lock className="w-8 h-8 text-green-300" />
            </div>
          </div>
          
          <h1 className="text-4xl text-sharp text-white mb-4">
            WELLNESS ASSESSMENT
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Complete your anonymous wellness survey with complete privacy protection through zero-knowledge proofs
          </p>
        </div>

        {/* Success State */}
        {uploadStatus === 'success' && ipfsHash && (
          <div className="mb-8 animate-scale-in">
            <div className="bg-gradient-to-r from-green-950 to-emerald-950 border border-green-800 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-lg text-sharp text-white">Assessment Uploaded Successfully!</h3>
              </div>
              <div className="space-y-3">
                <p className="text-green-300 font-medium">
                  Your wellness assessment has been securely uploaded to IPFS. Now proceeding to ZK Passport verification...
                </p>
                <div className="bg-green-950 border border-green-800 rounded-xl p-4">
                  <div className="text-sm text-green-400 mb-2 font-semibold">IPFS Hash:</div>
                  <div className="font-mono text-xs text-green-300 break-all bg-green-900/50 p-2 rounded-lg">
                    {ipfsHash}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ZK Verification Status */}
        {uploadStatus === 'zkverifying' && (
          <div className="mb-8 animate-scale-in">
            <div className="bg-gradient-to-r from-blue-950 to-indigo-950 border border-blue-800 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                <h3 className="text-lg text-sharp text-white">ZK Passport Verification in Progress</h3>
              </div>
              <p className="text-blue-300 font-medium">
                Please scan the QR code with your ZK Passport app to complete anonymous verification.
              </p>
            </div>
          </div>
        )}

        {/* Complete State */}
        {uploadStatus === 'complete' && zkConnected && (
          <div className="mb-8 animate-scale-in">
            <div className="bg-gradient-to-r from-green-950 to-emerald-950 border border-green-800 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="w-6 h-6 text-green-400 animate-pulse" />
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-lg text-sharp text-white">🎉 Verification Complete!</h3>
              </div>
              <div className="space-y-3">
                <p className="text-green-300 font-medium">
                  Your wellness assessment has been successfully submitted and verified with zero-knowledge proofs!
                </p>
                <ul className="text-green-300 space-y-1 text-sm font-medium">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>Data uploaded to IPFS: {ipfsHash}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>Identity verified with ZK Passport</span>
                  </li>
                  {transactionHash && (
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span>Transaction confirmed: {transactionHash.substring(0, 10)}...</span>
                    </li>
                  )}
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>Complete anonymity maintained</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {errorMessage && (
          <div className="mb-8 animate-scale-in">
            <div className="bg-gradient-to-r from-red-950 to-pink-950 border border-red-800 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <h3 className="text-lg text-sharp text-white">Submission Error</h3>
              </div>
              <p className="text-red-300 font-medium">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="relative animate-slide-up" style={{ animationDelay: '200ms' }}>
          <form onSubmit={handleFormSubmit} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 space-y-8">
            <PersonalInfoSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />
            
            <div className="border-t border-neutral-800 pt-8">
              <LifestyleSection 
                formData={formData} 
                onInputChange={handleInputChange} 
              />
            </div>
            
            <div className="border-t border-neutral-800 pt-8">
              <SensitiveQuestionsSection 
                formData={formData} 
                onInputChange={handleInputChange}
                onDrugUseChange={handleDrugUseChange}
              />
            </div>

            {/* Privacy Notice */}
            <div className="bg-gradient-to-r from-blue-950 to-purple-950 border border-blue-800 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <h4 className="text-lg text-sharp text-white">Privacy & Security</h4>
              </div>
              <ul className="text-blue-300 space-y-2 font-medium">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>Your responses are completely anonymous</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>Data is encrypted and stored on IPFS</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>ZK Passport ensures privacy-preserving authentication</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>IPFS hash bound to your verification proof</span>
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`w-full bg-gradient-to-r ${getSubmitButtonStyle()} disabled:from-neutral-800 disabled:to-neutral-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-3 shadow-lg hover:shadow-purple-500/25 tracking-wide`}
            >
              {getSubmitButtonContent()}
            </button>
            
            <p className="text-center text-sm text-neutral-400 font-medium">
              🛡️ Your data is encrypted and completely anonymous
            </p>
          </form>

          {/* ZK Passport QR Code Display - Enhanced with Real Status */}
          {showQRCode && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50 p-4">
              <ZKPassportQRCode 
                url={qrCodeUrl} 
                onClose={() => setShowQRCode(false)}
                ipfsHash={ipfsHash}
                status={zkStatus}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};