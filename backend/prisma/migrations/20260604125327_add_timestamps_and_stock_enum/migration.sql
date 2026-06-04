/*
  Warnings:

  - Added the required column `updatedAt` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SubCatalog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Stock" AS ENUM ('in_stock', 'out_of_stock', 'available_on_order');

-- AlterTable
ALTER TABLE "Image" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Image" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Image" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "stockStatus" "Stock" NOT NULL DEFAULT 'in_stock';

-- AlterTable
ALTER TABLE "SubCatalog" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "SubCatalog" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "SubCatalog" ALTER COLUMN "updatedAt" DROP DEFAULT;
