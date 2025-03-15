/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `TeamInvitation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TeamInvitation" ADD COLUMN     "token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "TeamInvitation_token_key" ON "TeamInvitation"("token");
