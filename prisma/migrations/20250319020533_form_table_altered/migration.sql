-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "settings" JSONB;

-- AlterTable
ALTER TABLE "TeamInvitation" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '7 days';
