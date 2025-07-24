import axios from 'axios';
import prisma from '../db';

interface CoinGeckoResponse {
    bitcoin: { usd: number };
    ethereum: { usd: number };
    tether: { usd: number };
    'usd-coin': { usd: number };
}

interface CryptoPrices {
    BTC: number;
    ETH: number;
    USDT: number;
    USDC: number;
}

export class PriceService {
    private static instance: PriceService;
    private cache: CryptoPrices | null = null;
    private lastFetch: Date | null = null;
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    public static getInstance(): PriceService {
        if (!PriceService.instance) {
            PriceService.instance = new PriceService();
        }
        return PriceService.instance;
    }

    /**
     * Fetch current crypto prices from CoinGecko API
     */
    private async fetchPricesFromAPI(): Promise<CryptoPrices> {
        try {
            const response = await axios.get<CoinGeckoResponse>(
                'https://api.coingecko.com/api/v3/simple/price',
                {
                    params: {
                        ids: 'bitcoin,ethereum,tether,usd-coin',
                        vs_currencies: 'usd'
                    },
                    timeout: 10000 // 10 second timeout
                }
            );

            return {
                BTC: response.data.bitcoin.usd,
                ETH: response.data.ethereum.usd,
                USDT: response.data.tether.usd,
                USDC: response.data['usd-coin'].usd
            };
        } catch (error) {
            console.error('Failed to fetch prices from CoinGecko:', error);
            throw new Error('Failed to fetch crypto prices');
        }
    }

    /**
     * Update price cache in database
     */
    public async updatePriceCache(): Promise<void> {
        try {
            const prices = await this.fetchPricesFromAPI();

            // Update database cache
            await Promise.all([
                prisma.cryptoPrice.upsert({
                    where: { symbol: 'BTC' },
                    update: { price: prices.BTC },
                    create: { symbol: 'BTC', price: prices.BTC }
                }),
                prisma.cryptoPrice.upsert({
                    where: { symbol: 'ETH' },
                    update: { price: prices.ETH },
                    create: { symbol: 'ETH', price: prices.ETH }
                }),
                prisma.cryptoPrice.upsert({
                    where: { symbol: 'USDT' },
                    update: { price: prices.USDT },
                    create: { symbol: 'USDT', price: prices.USDT }
                }),
                prisma.cryptoPrice.upsert({
                    where: { symbol: 'USDC' },
                    update: { price: prices.USDC },
                    create: { symbol: 'USDC', price: prices.USDC }
                })
            ]);

            // Update in-memory cache
            this.cache = prices;
            this.lastFetch = new Date();
        } catch (error) {
            console.error('Failed to update price cache:', error);
            throw error;
        }
    }

    /**
     * Get cached prices from database
     */
    private async getCachedPrices(): Promise<CryptoPrices> {
        const prices = await prisma.cryptoPrice.findMany({
            where: {
                symbol: { in: ['BTC', 'ETH', 'USDT', 'USDC'] }
            }
        });

        if (prices.length === 0) {
            throw new Error('No cached prices found');
        }

        const priceMap: CryptoPrices = {
            BTC: 0,
            ETH: 0,
            USDT: 1,
            USDC: 1
        };

        prices.forEach(price => {
            priceMap[price.symbol as keyof CryptoPrices] = price.price;
        });

        return priceMap;
    }

    /**
     * Get current crypto prices (with caching)
     */
    public async getCurrentPrices(): Promise<CryptoPrices> {
        const now = new Date();

        // Check if we have fresh in-memory cache
        if (this.cache && this.lastFetch &&
            (now.getTime() - this.lastFetch.getTime()) < this.CACHE_DURATION) {
            return this.cache;
        }

        try {
            // Try to get from database cache first
            const cachedPrices = await this.getCachedPrices();

            // Check if database cache is recent (within 10 minutes)
            const dbPrices = await prisma.cryptoPrice.findFirst({
                orderBy: { updatedAt: 'desc' }
            });

            if (dbPrices && (now.getTime() - dbPrices.updatedAt.getTime()) < 10 * 60 * 1000) {
                this.cache = cachedPrices;
                this.lastFetch = now;
                return cachedPrices;
            }

            // If database cache is stale, fetch new prices
            await this.updatePriceCache();
            return this.cache!;

        } catch (error) {
            // If everything fails, return fallback prices
            console.error('Failed to get current prices, using fallback:', error);
            return {
                BTC: 45000, // Fallback prices
                ETH: 3000,
                USDT: 1,
                USDC: 1
            };
        }
    }

    /**
     * Calculate user's main balance from crypto holdings
     */
    public async calculateMainBalance(userBalances: {
        bitcoinBalance: number;
        ethereumBalance: number;
        usdtBalance: number;
        usdcBalance: number;
    }): Promise<{
        totalBalance: number;
        breakdown: {
            bitcoin: number;
            ethereum: number;
            usdt: number;
            usdc: number;
        };
        prices: CryptoPrices;
    }> {
        const prices = await this.getCurrentPrices();

        const breakdown = {
            bitcoin: userBalances.bitcoinBalance * prices.BTC,
            ethereum: userBalances.ethereumBalance * prices.ETH,
            usdt: userBalances.usdtBalance * prices.USDT,
            usdc: userBalances.usdcBalance * prices.USDC
        };

        const totalBalance = breakdown.bitcoin + breakdown.ethereum + breakdown.usdt + breakdown.usdc;

        return {
            totalBalance,
            breakdown,
            prices
        };
    }
}

export default PriceService.getInstance();
