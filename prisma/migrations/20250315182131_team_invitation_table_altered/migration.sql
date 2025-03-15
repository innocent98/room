/*
  Warnings:

  - You are about to drop the column `status` on the `TeamInvitation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "TeamInvitation_token_key";

-- AlterTable
ALTER TABLE "TeamInvitation" DROP COLUMN "status",
ADD COLUMN     "expires" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '7 days';
