import axios from 'axios';
import prisma from '../db';

interface CryptoPrices {
    bitcoin: { usd: number };
    ethereum: { usd: number };
    tether: { usd: number };
    'usd-coin': { usd: number };
}

class CryptoPriceService {
    private cache: Map<string, { price: number; timestamp: number }> = new Map();
    private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

    async getCurrentPrices(): Promise<CryptoPrices> {
        try {
            console.log('🔄 Fetching prices from CoinGecko API...');
            const response = await axios.get(
                'https://api.coingecko.com/api/v3/simple/price',
                {
                    params: {
                        ids: 'bitcoin,ethereum,tether,usd-coin',
                        vs_currencies: 'usd'
                    }
                }
            );

            console.log('✅ CoinGecko API response:', response.data);

            // Update database with latest prices
            await this.updatePricesInDB(response.data);

            return response.data;
        } catch (error) {
            console.error('❌ Error fetching crypto prices from API:', error);
            console.error('❌ API Error details:', error.response?.data);
            // Fallback to database prices if API fails
            console.log('🔄 Falling back to database prices...');
            return await this.getPricesFromDB();
        }
    }

    async getCachedPrice(symbol: string): Promise<number> {
        const now = Date.now();
        const cached = this.cache.get(symbol);

        if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
            console.log(`📦 Using cached price for ${symbol}: $${cached.price}`);
            return cached.price;
        }

        console.log(`🔄 Cache miss for ${symbol}, fetching fresh prices...`);

        // Fetch fresh prices
        const prices = await this.getCurrentPrices();
        const price = this.extractPriceForSymbol(symbol, prices);

        console.log(`💰 Fresh price for ${symbol}: $${price}`);

        // Update cache
        this.cache.set(symbol, { price, timestamp: now });

        return price;
    }

    async getAssetPrice(assetType: string): Promise<number> {
        const symbolMap: { [key: string]: string } = {
            'BITCOIN': 'bitcoin',
            'ETHEREUM': 'ethereum',
            'USDT': 'tether',
            'USDC': 'usd-coin'
        };

        const symbol = symbolMap[assetType];
        if (!symbol) {
            throw new Error(`Unsupported asset type: ${assetType}`);
        }

        return await this.getCachedPrice(symbol);
    }

    private extractPriceForSymbol(symbol: string, prices: CryptoPrices): number {
        switch (symbol) {
            case 'bitcoin':
                return prices.bitcoin.usd;
            case 'ethereum':
                return prices.ethereum.usd;
            case 'tether':
                return prices.tether.usd;
            case 'usd-coin':
                return prices['usd-coin'].usd;
            default:
                return 1; // Default to 1 for stablecoins
        }
    }

    private async updatePricesInDB(prices: CryptoPrices) {
        try {
            const updates = [
                { symbol: 'BTC', price: prices.bitcoin.usd },
                { symbol: 'ETH', price: prices.ethereum.usd },
                { symbol: 'USDT', price: prices.tether.usd },
                { symbol: 'USDC', price: prices['usd-coin'].usd }
            ];

            for (const { symbol, price } of updates) {
                await prisma.cryptoPrice.upsert({
                    where: { symbol },
                    update: { price, updatedAt: new Date() },
                    create: { symbol, price }
                });
            }
        } catch (error) {
            console.error('Error updating prices in database:', error);
        }
    }

    private async getPricesFromDB(): Promise<CryptoPrices> {
        try {
            console.log('🔄 Fetching prices from database...');
            const dbPrices = await prisma.cryptoPrice.findMany({
                where: {
                    symbol: { in: ['BTC', 'ETH', 'USDT', 'USDC'] }
                }
            });

            console.log('📊 Database prices found:', dbPrices);

            const priceMap = dbPrices.reduce((acc, price) => {
                acc[price.symbol] = price.price;
                return acc;
            }, {} as { [key: string]: number });

            const result = {
                bitcoin: { usd: priceMap['BTC'] || 50000 },
                ethereum: { usd: priceMap['ETH'] || 3000 },
                tether: { usd: priceMap['USDT'] || 1 },
                'usd-coin': { usd: priceMap['USDC'] || 1 }
            };

            console.log('📈 Using prices from database:', result);
            return result;
        } catch (error) {
            console.error('❌ Error fetching prices from database:', error);
            console.log('⚠️ Using default fallback prices');
            // Return default prices as last resort
            return {
                bitcoin: { usd: 50000 },
                ethereum: { usd: 3000 },
                tether: { usd: 1 },
                'usd-coin': { usd: 1 }
            };
        }
    }

    async calculateMainBalance(user: any): Promise<number> {
        try {
            const btcPrice = await this.getAssetPrice('BITCOIN');
            const ethPrice = await this.getAssetPrice('ETHEREUM');
            const usdtPrice = await this.getAssetPrice('USDT');
            const usdcPrice = await this.getAssetPrice('USDC');

            const mainBalance =
                (user.bitcoinBalance * btcPrice) +
                (user.ethereumBalance * ethPrice) +
                (user.usdtBalance * usdtPrice) +
                (user.usdcBalance * usdcPrice);

            return Number(mainBalance.toFixed(2));
        } catch (error) {
            console.error('Error calculating main balance:', error);
            return 0;
        }
    }
}

export default new CryptoPriceService();
