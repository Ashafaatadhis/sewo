/*
  Warnings:

  - You are about to drop the column `userId` on the `Account_token` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tokenId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_tokenId_fkey";

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Account_token" DROP CONSTRAINT "Account_token_userId_fkey";

-- DropIndex
DROP INDEX "Account_token_userId_key";

-- AlterTable
ALTER TABLE "Account_token" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tokenId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Account";

-- CreateIndex
CREATE UNIQUE INDEX "User_tokenId_key" ON "User"("tokenId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Account_token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
