/*
  Warnings:

  - You are about to drop the column `catalogId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_catalogId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "catalogId";

-- CreateTable
CREATE TABLE "SubCatalog" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "catalogId" TEXT NOT NULL,

    CONSTRAINT "SubCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToSubCatalog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductToSubCatalog_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProductToSubCatalog_B_index" ON "_ProductToSubCatalog"("B");

-- AddForeignKey
ALTER TABLE "SubCatalog" ADD CONSTRAINT "SubCatalog_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "Catalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToSubCatalog" ADD CONSTRAINT "_ProductToSubCatalog_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToSubCatalog" ADD CONSTRAINT "_ProductToSubCatalog_B_fkey" FOREIGN KEY ("B") REFERENCES "SubCatalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
