-- AlterTable
ALTER TABLE "User" ADD COLUMN     "useCalculatedBalance" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "CryptoPrice" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CryptoPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CryptoPrice_symbol_key" ON "CryptoPrice"("symbol");
