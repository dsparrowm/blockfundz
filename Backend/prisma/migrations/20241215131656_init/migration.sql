-- DropForeignKey
ALTER TABLE "InvestmentPlan" DROP CONSTRAINT "InvestmentPlan_userId_fkey";

-- AlterTable
ALTER TABLE "InvestmentPlan" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "InvestmentPlan" ADD CONSTRAINT "InvestmentPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
