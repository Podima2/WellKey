import React from 'react';
import { TrendingUp, Activity } from 'lucide-react';
import { OraclePrice } from '../../types';

interface OraclePricesProps {
  prices: OraclePrice[];
}

export const OraclePrices: React.FC<OraclePricesProps> = ({ prices }) => {
  const formatPrice = (price: number, asset: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: asset === 'BTC' ? 0 : 2,
      maximumFractionDigits: asset === 'BTC' ? 0 : 2,
    }).format(price);
  };

  const getAssetIcon = (asset: string) => {
    const icons = {
      BTC: '₿',
      ETH: 'Ξ',
      SOL: '◎'
    };
    return icons[asset as keyof typeof icons] || '●';
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl">
            <Activity className="w-5 h-5 text-neutral-300" />
          </div>
          <div>
            <h3 className="text-lg text-sharp text-white">LIVE ORACLE PRICES</h3>
            <p className="text-sm text-neutral-400 font-medium">Real-time market data</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-green-950 border border-green-800 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400 font-bold tracking-wide">LIVE</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {prices.map((oracle, index) => (
          <div
            key={oracle.asset}
            className="group bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:bg-neutral-800 hover:border-neutral-700 transition-all duration-300 animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-neutral-800 border border-neutral-700 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {getAssetIcon(oracle.asset)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg text-sharp text-white">{oracle.asset}</span>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-sm text-neutral-400 font-medium">
                    Updated {oracle.lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-white mb-1">
                  {formatPrice(oracle.price, oracle.asset)}
                </div>
                <div className="flex items-center space-x-1 text-green-400 text-sm font-semibold">
                  <TrendingUp className="w-3 h-3" />
                  <span>+2.4%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};