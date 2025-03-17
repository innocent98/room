-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "device" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "TeamInvitation" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '7 days';
