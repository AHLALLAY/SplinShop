-- AlterTable
ALTER TABLE "Catalog" ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false;
