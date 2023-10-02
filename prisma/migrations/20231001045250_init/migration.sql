/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Account_token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Account_token_token_key" ON "Account_token"("token");
