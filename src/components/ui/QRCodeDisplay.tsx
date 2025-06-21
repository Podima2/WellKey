import React from 'react';
import { X, Smartphone, Shield } from 'lucide-react';

interface QRCodeDisplayProps {
  url: string;
  onClose: () => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ url, onClose }) => {
  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-green-900 to-emerald-900 border border-green-800 rounded-xl">
            <Shield className="w-6 h-6 text-green-300" />
          </div>
          <div>
            <h3 className="text-xl text-sharp text-white">ZK Passport Verification</h3>
            <p className="text-neutral-400 text-sm font-medium">Scan to verify anonymously</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-neutral-800 rounded-xl transition-colors"
        >
          <X className="w-5 h-5 text-neutral-400" />
        </button>
      </div>

      <div className="text-center space-y-6">
        {/* Mock QR Code */}
        <div className="w-48 h-48 mx-auto bg-white rounded-xl p-4 flex items-center justify-center">
          <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-8 gap-1 w-32 h-32">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-full h-full ${
                    Math.random() > 0.5 ? 'bg-white' : 'bg-black'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-neutral-400">
            <Smartphone className="w-5 h-5" />
            <span className="font-semibold tracking-wide">SCAN WITH ZK PASSPORT APP</span>
          </div>
          
          <div className="bg-gradient-to-r from-green-950 to-emerald-950 border border-green-800 rounded-xl p-4">
            <ul className="text-green-300 space-y-2 text-sm font-medium">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>Your identity remains completely private</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>Zero-knowledge proof of humanity</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>No personal data is stored or shared</span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-neutral-500 font-medium">
            Verification URL: {url.substring(0, 40)}...
          </p>
        </div>
      </div>
    </div>
  );
};