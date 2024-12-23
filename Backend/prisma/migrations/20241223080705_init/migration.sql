/*
  Warnings:

  - You are about to drop the column `userId` on the `InvestmentPlan` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionStatus" ADD VALUE 'ACTIVE';
ALTER TYPE "TransactionStatus" ADD VALUE 'INACTIVE';

-- DropForeignKey
ALTER TABLE "InvestmentPlan" DROP CONSTRAINT "InvestmentPlan_userId_fkey";

-- DropIndex
DROP INDEX "InvestmentPlan_userId_key";

-- AlterTable
ALTER TABLE "InvestmentPlan" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "planId" INTEGER;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_planId_fkey" FOREIGN KEY ("planId") REFERENCES "InvestmentPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
