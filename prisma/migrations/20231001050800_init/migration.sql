/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Account_token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Account_token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account_token" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_token_userId_key" ON "Account_token"("userId");

-- AddForeignKey
ALTER TABLE "Account_token" ADD CONSTRAINT "Account_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
