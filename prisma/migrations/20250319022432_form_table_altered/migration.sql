-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "bannerImage" TEXT;

-- AlterTable
ALTER TABLE "TeamInvitation" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '7 days';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFactorSecret" TEXT;
