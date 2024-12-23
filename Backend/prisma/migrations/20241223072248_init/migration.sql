/*
  Warnings:

  - You are about to drop the column `usdValue` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "usdValue",
ADD COLUMN     "planName" TEXT;
