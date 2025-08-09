-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionType" ADD VALUE 'CREDIT_BITCOIN';
ALTER TYPE "TransactionType" ADD VALUE 'CREDIT_ETHEREUM';
ALTER TYPE "TransactionType" ADD VALUE 'CREDIT_USDT';
ALTER TYPE "TransactionType" ADD VALUE 'CREDIT_USDC';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "adminId" INTEGER,
ADD COLUMN     "exchangeRate" DOUBLE PRECISION,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "usdEquivalent" DOUBLE PRECISION;
