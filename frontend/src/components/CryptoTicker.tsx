import React, { useEffect, useState } from 'react';

const CryptoTicker = () => {
    const [cryptoData, setCryptoData] = useState([
        { symbol: 'BTC', price: 64823.45, change: 2.45 },
        { symbol: 'ETH', price: 3321.67, change: -1.23 },
        { symbol: 'SOL', price: 154.89, change: 5.78 },
        { symbol: 'BNB', price: 320.84, change: 0.8 },
        { symbol: 'XRP', price: 0.58, change: -2.1 },
        { symbol: 'ADA', price: 1.24, change: 3.2 }



    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCryptoData(prev => prev.map(coin => ({
                ...coin,
                price: coin.price * (1 + (Math.random() * 0.02 - 0.01)),
                change: coin.change + (Math.random() * 0.4 - 0.2)
            })));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex-1 h-full mx-4 overflow-hidden relative bg-transparent">
            <div className="animate-marquee whitespace-nowrap h-full flex items-center">
                {cryptoData.map((coin, index) => (
                    <div
                        key={index}
                        className="inline-flex items-center mx-6"
                    >
                        <span className="text-slate-800 font-semibold text-sm">{coin.symbol}</span>
                        <span className="text-slate-600 mx-2 text-sm">${coin.price.toFixed(2)}</span>
                        <span className={`text-xs font-medium ${coin.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                    display: inline-flex;
                    position: absolute;
                    white-space: nowrap;
                    will-change: transform;
                }
                
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default CryptoTicker;