/*
  Warnings:

  - Added the required column `network` to the `WithdrawalRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WithdrawalRequest" ADD COLUMN     "network" TEXT NOT NULL;
