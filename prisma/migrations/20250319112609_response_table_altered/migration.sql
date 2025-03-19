/*
  Warnings:

  - You are about to drop the column `data` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Response` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Response" DROP COLUMN "data",
DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "TeamInvitation" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '7 days';
