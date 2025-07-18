import prisma from '../db';
import * as cron from 'node-cron';

export class InterestCalculationService {

    /**
     * Calculate and credit daily interest for all active investments
     */
    static async calculateDailyInterest() {
        try {
            console.log('Starting daily interest calculation...');

            // Get all active investment transactions
            const activeInvestments = await prisma.transaction.findMany({
                where: {
                    type: 'SUBSCRIPTION',
                    status: 'ACTIVE',
                },
                include: {
                    plan: true,
                    user: true
                }
            });

            let totalProcessed = 0;
            let totalCredited = 0;

            for (const investment of activeInvestments) {
                try {
                    const credited = await this.processInvestmentInterest(investment);
                    if (credited > 0) {
                        totalCredited += credited;
                        totalProcessed++;
                    }
                } catch (error) {
                    console.error(`Error processing interest for investment ${investment.id}:`, error);
                }
            }

            console.log(`Daily interest calculation completed. Processed ${totalProcessed} investments, credited $${totalCredited.toFixed(2)} total`);

            return {
                processed: totalProcessed,
                totalCredited
            };
        } catch (error) {
            console.error('Error in daily interest calculation:', error);
            throw error;
        }
    }

    /**
     * Process interest for a single investment
     */
    private static async processInvestmentInterest(investment: any): Promise<number> {
        if (!investment.plan || !investment.amount || !investment.plan.interestRate) {
            return 0;
        }

        const now = new Date();
        const lastCalculation = investment.lastInterestCalculation || investment.date;
        const timeDiff = now.getTime() - new Date(lastCalculation).getTime();
        const daysSinceLastCalculation = Math.floor(timeDiff / (1000 * 3600 * 24));

        // Only calculate if at least 24 hours have passed
        if (daysSinceLastCalculation < 1) {
            return 0;
        }

        const investmentAmount = parseFloat(investment.amount.toString());
        const dailyInterestRate = parseFloat(investment.plan.interestRate.toString()) / 100 / 365; // Daily rate
        const interestEarned = investmentAmount * dailyInterestRate * daysSinceLastCalculation;

        if (interestEarned <= 0) {
            return 0;
        }

        // Start transaction to ensure data consistency
        const result = await prisma.$transaction(async (prisma) => {
            // Credit interest to user's main balance
            await prisma.user.update({
                where: { id: investment.userId },
                data: {
                    mainBalance: { increment: interestEarned }
                }
            });

            // Update the last interest calculation timestamp
            await prisma.transaction.update({
                where: { id: investment.id },
                data: {
                    lastInterestCalculation: now
                }
            });

            // Create a transaction record for the interest credit
            await prisma.transaction.create({
                data: {
                    type: 'DEPOSIT',
                    asset: investment.asset,
                    amount: interestEarned,
                    status: 'COMPLETED',
                    userId: investment.userId,
                    details: `Daily interest from ${investment.plan.plan} plan (${daysSinceLastCalculation} days)`,
                    planId: investment.planId,
                    lastInterestCalculation: now
                }
            });

            return interestEarned;
        });

        console.log(`Credited $${interestEarned.toFixed(6)} interest to user ${investment.userId} from plan ${investment.plan.plan}`);
        return result;
    }

    /**
     * Start the cron job for daily interest calculation
     */
    static startInterestCalculationScheduler() {
        // Run every day at midnight (00:00)
        cron.schedule('0 0 * * *', async () => {
            console.log('Running scheduled daily interest calculation...');
            try {
                await this.calculateDailyInterest();
            } catch (error) {
                console.error('Scheduled interest calculation failed:', error);
            }
        }, {
            timezone: "UTC"
        });

        console.log('Daily interest calculation scheduler started (runs at 00:00 UTC)');
    }

    /**
     * Manual trigger for interest calculation (for testing)
     */
    static async manualInterestCalculation() {
        console.log('Manual interest calculation triggered...');
        return await this.calculateDailyInterest();
    }
}
