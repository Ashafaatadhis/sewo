/*
  Warnings:

  - Added the required column `provider` to the `Users_email` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Users_email_email_key";

-- AlterTable
ALTER TABLE "Users_email" ADD COLUMN     "provider" TEXT NOT NULL;
