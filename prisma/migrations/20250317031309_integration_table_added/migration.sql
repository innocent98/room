-- AlterTable
ALTER TABLE "TeamInvitation" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '7 days';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "apiKey" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "notificationPreferences" TEXT,
ADD COLUMN     "privacySettings" TEXT,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Integration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "config" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Integration_userId_type_key" ON "Integration"("userId", "type");
