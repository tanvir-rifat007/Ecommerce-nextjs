/*
  Warnings:

  - You are about to drop the column `Images` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "Images",
ADD COLUMN     "images" TEXT[];
