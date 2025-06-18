import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const CryptoTicker = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([
    { symbol: 'BTC', name: 'Bitcoin', price: 43567.89, change: 1234.56, changePercent: 2.91 },
    { symbol: 'ETH', name: 'Ethereum', price: 2543.21, change: -45.67, changePercent: -1.76 },
    { symbol: 'ADA', name: 'Cardano', price: 0.4523, change: 0.0234, changePercent: 5.46 },
    { symbol: 'SOL', name: 'Solana', price: 89.45, change: 3.21, changePercent: 3.72 },
    { symbol: 'DOT', name: 'Polkadot', price: 7.23, change: -0.15, changePercent: -2.03 },
    { symbol: 'XRP', name: 'Ripple', price: 0.5678, change: 0.0123, changePercent: 2.21 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoData(prev => prev.map(crypto => ({
        ...crypto,
        price: crypto.price + (Math.random() - 0.5) * 100,
        change: (Math.random() - 0.5) * 200,
        changePercent: (Math.random() - 0.5) * 10
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 mb-8 bg-gray-800 rounded-xl">
      <h3 className="text-xl font-semibold mb-4 text-white">Live Market</h3>
      <div className="overflow-x-auto">
        <div className="flex space-x-6 min-w-max">
          {cryptoData.map((crypto) => (
            <div key={crypto.symbol} className="flex bg-gray-700 items-center space-x-3 p-4 glass-card rounded-lg min-w-48">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">{crypto.symbol}</span>
                  <span className="text-gray-400 text-sm">{crypto.name}</span>
                </div>
                <div className="text-lg font-semibold text-white">
                  ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`flex items-center space-x-1 text-sm ${crypto.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {crypto.changePercent >= 0 ?
                    <TrendingUp className="w-4 h-4 text-green-500" /> :
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  }
                  <span>{crypto.changePercent.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CryptoTicker;
