/*
  Warnings:

  - The values [BTC,ETH] on the enum `AssetType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AssetType_new" AS ENUM ('BITCOIN', 'ETHEREUM', 'USDT', 'USDC');
ALTER TABLE "Transaction" ALTER COLUMN "asset" TYPE "AssetType_new" USING ("asset"::text::"AssetType_new");
ALTER TABLE "WithdrawalRequest" ALTER COLUMN "asset" TYPE "AssetType_new" USING ("asset"::text::"AssetType_new");
ALTER TYPE "AssetType" RENAME TO "AssetType_old";
ALTER TYPE "AssetType_new" RENAME TO "AssetType";
DROP TYPE "AssetType_old";
COMMIT;
