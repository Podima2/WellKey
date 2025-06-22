import React from 'react';
import { X, Smartphone, Shield, ExternalLink, CheckCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';

interface ZKPassportQRCodeProps {
  url: string;
  onClose: () => void;
  ipfsHash?: string;
  status?: 'scanning' | 'generating' | 'verifying' | 'complete' | 'error';
  onStatusChange?: (status: string) => void;
}

export const ZKPassportQRCode: React.FC<ZKPassportQRCodeProps> = ({ 
  url, 
  onClose, 
  ipfsHash,
  status = 'scanning',
  onStatusChange 
}) => {
  // Generate QR code URL using a QR code service - BIGGER SIZE
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;

  const getStatusConfig = () => {
    switch (status) {
      case 'scanning':
        return {
          icon: Smartphone,
          title: 'Waiting for Scan',
          description: 'Please scan the QR code with your ZK Passport app',
          color: 'text-blue-400',
          bgColor: 'from-blue-950 to-indigo-950 border-blue-800',
          showSpinner: false
        };
      case 'generating':
        return {
          icon: Shield,
          title: 'Generating Proof',
          description: 'Creating zero-knowledge proof of your identity',
          color: 'text-yellow-400',
          bgColor: 'from-yellow-950 to-orange-950 border-yellow-800',
          showSpinner: true
        };
      case 'verifying':
        return {
          icon: CheckCircle,
          title: 'Verifying On-Chain',
          description: 'Submitting proof to blockchain for verification',
          color: 'text-purple-400',
          bgColor: 'from-purple-950 to-pink-950 border-purple-800',
          showSpinner: true
        };
      case 'complete':
        return {
          icon: Sparkles,
          title: 'Verification Complete!',
          description: 'Your wellness assessment has been successfully verified',
          color: 'text-green-400',
          bgColor: 'from-green-950 to-emerald-950 border-green-800',
          showSpinner: false
        };
      case 'error':
        return {
          icon: AlertCircle,
          title: 'Verification Failed',
          description: 'There was an error during verification. Please try again.',
          color: 'text-red-400',
          bgColor: 'from-red-950 to-pink-950 border-red-800',
          showSpinner: false
        };
      default:
        return {
          icon: Smartphone,
          title: 'Waiting for Scan',
          description: 'Please scan the QR code with your ZK Passport app',
          color: 'text-blue-400',
          bgColor: 'from-blue-950 to-indigo-950 border-blue-800',
          showSpinner: false
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  // If complete, show compact success modal
  if (status === 'complete') {
    return (
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-lg mx-auto animate-scale-in">
        {/* Compact Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-green-400 animate-pulse" />
            <h3 className="text-lg text-sharp text-white">Verification Complete!</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-neutral-400" />
          </button>
        </div>

        {/* Compact Success Content */}
        <div className="p-6 space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <Sparkles className="w-6 h-6 text-green-400 animate-pulse" />
            </div>
            <p className="text-green-300 font-medium text-sm">
              Your wellness assessment has been successfully submitted with complete anonymity and cryptographic verification.
            </p>
          </div>

          {/* Compact Status Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-950/50 border border-green-800 rounded-lg p-3 text-center">
              <div className="text-xs text-green-400 font-bold mb-1">IPFS UPLOAD</div>
              <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
            </div>
            <div className="bg-green-950/50 border border-green-800 rounded-lg p-3 text-center">
              <div className="text-xs text-green-400 font-bold mb-1">ZK VERIFIED</div>
              <Shield className="w-4 h-4 text-green-400 mx-auto" />
            </div>
            <div className="bg-green-950/50 border border-green-800 rounded-lg p-3 text-center">
              <div className="text-xs text-green-400 font-bold mb-1">ON-CHAIN</div>
              <ExternalLink className="w-4 h-4 text-green-400 mx-auto" />
            </div>
            <div className="bg-green-950/50 border border-green-800 rounded-lg p-3 text-center">
              <div className="text-xs text-green-400 font-bold mb-1">ANONYMOUS</div>
              <Sparkles className="w-4 h-4 text-green-400 mx-auto" />
            </div>
          </div>

          {/* Compact IPFS Hash */}
          {ipfsHash && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
              <div className="text-xs text-neutral-400 font-bold mb-2">IPFS HASH</div>
              <div className="font-mono text-xs text-neutral-300 break-all mb-2">
                {ipfsHash}
              </div>
              <a
                href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:scale-105 active:scale-95"
              >
                <span>View on IPFS</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide"
          >
            CONTINUE
          </button>
        </div>
      </div>
    );
  }

  // Regular modal for other states
  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-4xl mx-auto animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-green-900 to-emerald-900 border border-green-800 rounded-xl">
            <Shield className="w-6 h-6 text-green-300" />
          </div>
          <div>
            <h3 className="text-xl text-sharp text-white">ZK Passport Verification</h3>
            <p className="text-neutral-400 text-sm font-medium">Anonymous identity verification</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-neutral-800 rounded-xl transition-colors"
        >
          <X className="w-5 h-5 text-neutral-400" />
        </button>
      </div>

      {/* Status Display */}
      <div className="p-6 border-b border-neutral-800">
        <div className={`bg-gradient-to-r ${statusConfig.bgColor} rounded-xl p-6`}>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-3">
              {statusConfig.showSpinner ? (
                <div className={`w-8 h-8 border-2 border-current/30 border-t-current rounded-full animate-spin ${statusConfig.color}`} />
              ) : (
                <StatusIcon className={`w-8 h-8 ${statusConfig.color}`} />
              )}
              <div>
                <h4 className={`text-lg font-bold ${statusConfig.color}`}>{statusConfig.title}</h4>
                <p className={`text-sm font-medium ${statusConfig.color.replace('400', '300')}`}>
                  {statusConfig.description}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {['scanning', 'generating', 'verifying', 'complete'].map((step, index) => {
                const stepIndex = ['scanning', 'generating', 'verifying', 'complete'].indexOf(status);
                const isActive = step === status;
                const isCompleted = stepIndex > index;
                
                return (
                  <React.Fragment key={step}>
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-green-400' : 
                      isActive ? statusConfig.color.replace('text-', 'bg-') : 
                      'bg-neutral-600'
                    }`} />
                    {index < 3 && (
                      <div className={`flex-1 h-0.5 transition-all duration-300 ${
                        isCompleted ? 'bg-green-400' : 'bg-neutral-600'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <div className="flex justify-between text-xs font-semibold tracking-wide">
              <span className={status === 'scanning' ? statusConfig.color : 'text-neutral-500'}>SCAN</span>
              <span className={status === 'generating' ? statusConfig.color : 'text-neutral-500'}>GENERATE</span>
              <span className={status === 'verifying' ? statusConfig.color : 'text-neutral-500'}>VERIFY</span>
              <span className={status === 'complete' ? statusConfig.color : 'text-neutral-500'}>COMPLETE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <div className="flex flex-col items-center space-y-6">
            <div className="w-80 h-80 bg-white rounded-2xl p-6 flex items-center justify-center shadow-2xl">
              <img 
                src={qrCodeImageUrl} 
                alt="ZK Passport QR Code" 
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  // Fallback to mock QR code if service fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="w-full h-full bg-black rounded-xl flex items-center justify-center">
                      <div class="grid grid-cols-12 gap-1 w-64 h-64">
                        ${Array.from({ length: 144 }).map(() => 
                          `<div class="w-full h-full ${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}"></div>`
                        ).join('')}
                      </div>
                    </div>
                  `;
                }}
              />
            </div>
            
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-2 text-neutral-400">
                <Smartphone className="w-5 h-5" />
                <span className="font-semibold tracking-wide">SCAN WITH ZK PASSPORT APP</span>
              </div>
              
              <button
                onClick={() => window.open(url, '_blank')}
                className="inline-flex items-center space-x-2 text-sm text-neutral-400 hover:text-white transition-colors font-medium hover:scale-105 active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open verification link</span>
              </button>
            </div>
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            {/* IPFS Hash Display */}
            {ipfsHash && (
              <div className="bg-gradient-to-r from-blue-950 to-purple-950 border border-blue-800 rounded-xl p-6">
                <div className="text-sm text-blue-400 mb-3 font-semibold flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Wellness Data IPFS Hash</span>
                </div>
                <div className="font-mono text-xs text-blue-300 break-all bg-blue-900/50 p-3 rounded-lg mb-3">
                  {ipfsHash}
                </div>
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:scale-105 active:scale-95"
                >
                  <span>View on IPFS Gateway</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
            
            {/* Privacy Features */}
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 border border-neutral-700 rounded-xl p-6">
              <h5 className="text-white font-bold mb-4 flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Privacy Features</span>
              </h5>
              <ul className="text-neutral-300 space-y-3 text-sm font-medium">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                  <span>Your identity remains completely private</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                  <span>Zero-knowledge proof of humanity</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                  <span>Wellness data cryptographically bound</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></div>
                  <span>No personal data stored or shared</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
                  <span>Blockchain verification without revealing identity</span>
                </li>
              </ul>
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <div className="bg-gradient-to-r from-red-950 to-pink-950 border border-red-800 rounded-xl p-6 animate-scale-in">
                <div className="text-center space-y-4">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
                  <div>
                    <h4 className="text-lg font-bold text-red-400 mb-2">Verification Failed</h4>
                    <p className="text-red-300 font-medium">
                      There was an error during the verification process. Please try again or contact support if the issue persists.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};