-- AlterTable
ALTER TABLE "TeamInvitation" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "expires" SET DEFAULT NOW() + interval '7 days';
