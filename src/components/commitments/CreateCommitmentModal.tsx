import React, { useState } from 'react';
import { X, Lock, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { CommitmentCondition } from '../../types';

interface CreateCommitmentModalProps {
  onCreateCommitment: (secret: string, description: string, condition: CommitmentCondition) => void;
  onClose: () => void;
}

export const CreateCommitmentModal: React.FC<CreateCommitmentModalProps> = ({ 
  onCreateCommitment, 
  onClose 
}) => {
  const [step, setStep] = useState(1);
  const [secret, setSecret] = useState('');
  const [description, setDescription] = useState('');
  const [conditionType, setConditionType] = useState<'manual' | 'price' | 'time'>('manual');
  const [priceTarget, setPriceTarget] = useState('');
  const [priceAsset, setPriceAsset] = useState('BTC');
  const [timeExpiry, setTimeExpiry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let condition: CommitmentCondition;
    
    switch (conditionType) {
      case 'price':
        condition = {
          type: 'price',
          description: `Auto-reveal when ${priceAsset} reaches $${Number(priceTarget).toLocaleString()}`,
          target: parseFloat(priceTarget),
          asset: priceAsset,
        };
        break;
      case 'time':
        condition = {
          type: 'time',
          description: `Auto-reveal on ${new Date(timeExpiry).toLocaleDateString()} at ${new Date(timeExpiry).toLocaleTimeString()}`,
          expiry: new Date(timeExpiry),
        };
        break;
      default:
        condition = {
          type: 'manual',
          description: 'Manual reveal only',
        };
    }

    onCreateCommitment(secret, description, condition);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-scale-in">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl">
              <Lock className="w-6 h-6 text-neutral-300" />
            </div>
            <div>
              <h3 className="text-xl text-sharp text-white">CREATE ZK COMMITMENT</h3>
              <p className="text-neutral-400 font-medium">Step {step} of 3</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-neutral-600' : 'bg-neutral-800'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-neutral-400 font-bold tracking-wide">
            <span>SECRET</span>
            <span>CONDITION</span>
            <span>REVIEW</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <label className="block text-sm font-bold text-neutral-300 mb-3 tracking-wide">
                  YOUR SECRET MESSAGE
                </label>
                <textarea
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter your secret (e.g., 'I predict Bitcoin will hit $120k by March 2024')"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-4 text-white placeholder-neutral-400 focus:border-neutral-600 focus:ring-2 focus:ring-neutral-600/20 transition-all duration-200 resize-none font-medium"
                  rows={4}
                  required
                />
                <p className="text-xs text-neutral-500 mt-2 font-medium">
                  This will be cryptographically hashed and stored as a commitment
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-300 mb-3 tracking-wide">
                  PUBLIC DESCRIPTION
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief public description (e.g., 'Bitcoin Price Prediction')"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-4 text-white placeholder-neutral-400 focus:border-neutral-600 focus:ring-2 focus:ring-neutral-600/20 transition-all duration-200 font-medium"
                  required
                />
              </div>

              <button
                type="button"
                onClick={nextStep}
                disabled={!secret || !description}
                className="w-full bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 disabled:from-neutral-900 disabled:to-neutral-900 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] tracking-wide"
              >
                CONTINUE
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <label className="block text-sm font-bold text-neutral-300 mb-4 tracking-wide">
                  REVEAL CONDITION
                </label>
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {[
                    { type: 'manual', icon: Lock, title: 'MANUAL REVEAL', desc: 'Reveal whenever you choose' },
                    { type: 'price', icon: DollarSign, title: 'PRICE TRIGGER', desc: 'Auto-reveal when asset hits target price' },
                    { type: 'time', icon: Clock, title: 'TIME LOCK', desc: 'Auto-reveal at specific date/time' }
                  ].map(({ type, icon: Icon, title, desc }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setConditionType(type as any)}
                      className={`p-4 rounded-xl border transition-all duration-200 text-left hover:scale-[1.01] active:scale-[0.99] ${
                        conditionType === type
                          ? 'bg-neutral-800 border-neutral-700 text-white'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <div className="font-bold text-sharp-light">{title}</div>
                          <div className="text-sm opacity-75 font-medium">{desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {conditionType === 'price' && (
                  <div className="grid grid-cols-2 gap-4 animate-scale-in">
                    <select
                      value={priceAsset}
                      onChange={(e) => setPriceAsset(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-neutral-600 focus:ring-2 focus:ring-neutral-600/20 font-medium"
                    >
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="ETH">Ethereum (ETH)</option>
                      <option value="SOL">Solana (SOL)</option>
                    </select>
                    <input
                      type="number"
                      value={priceTarget}
                      onChange={(e) => setPriceTarget(e.target.value)}
                      placeholder="Target price (USD)"
                      className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:border-neutral-600 focus:ring-2 focus:ring-neutral-600/20 font-medium"
                      required={conditionType === 'price'}
                    />
                  </div>
                )}

                {conditionType === 'time' && (
                  <input
                    type="datetime-local"
                    value={timeExpiry}
                    onChange={(e) => setTimeExpiry(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-neutral-600 focus:ring-2 focus:ring-neutral-600/20 animate-scale-in font-medium"
                    required={conditionType === 'time'}
                  />
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-all duration-200 font-bold hover:scale-[1.02] active:scale-[0.98] tracking-wide"
                >
                  BACK
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] tracking-wide"
                >
                  REVIEW
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-slide-up">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
                <h4 className="text-lg text-sharp text-white mb-4">REVIEW YOUR COMMITMENT</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-neutral-400 font-bold tracking-wide">DESCRIPTION</label>
                    <p className="text-white font-semibold">{description}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-neutral-400 font-bold tracking-wide">SECRET PREVIEW</label>
                    <p className="text-white font-mono text-sm bg-neutral-800 p-3 rounded-lg">
                      {secret.substring(0, 50)}...
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-neutral-400 font-bold tracking-wide">REVEAL CONDITION</label>
                    <p className="text-white font-semibold">
                      {conditionType === 'price' && `Auto-reveal when ${priceAsset} reaches $${Number(priceTarget).toLocaleString()}`}
                      {conditionType === 'time' && `Auto-reveal on ${new Date(timeExpiry).toLocaleDateString()}`}
                      {conditionType === 'manual' && 'Manual reveal only'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-all duration-200 font-bold hover:scale-[1.02] active:scale-[0.98] tracking-wide"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] tracking-wide"
                >
                  <Lock className="w-5 h-5" />
                  <span>CREATE COMMITMENT</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};