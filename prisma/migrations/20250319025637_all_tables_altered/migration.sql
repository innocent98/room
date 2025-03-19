/*
  Warnings:

  - You are about to drop the column `bannerImage` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `settings` on the `Form` table. All the data in the column will be lost.
  - Added the required column `data` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Field" ADD COLUMN     "conditionalLogic" TEXT,
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Form" DROP COLUMN "bannerImage",
DROP COLUMN "settings";

-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "data" JSONB NOT NULL,
ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "TeamInvitation" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '7 days';

-- CreateTable
CREATE TABLE "FormSettings" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "showProgressBar" BOOLEAN NOT NULL DEFAULT false,
    "allowMultipleSubmissions" BOOLEAN NOT NULL DEFAULT false,
    "confirmationMessage" TEXT,
    "redirectUrl" TEXT,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT false,
    "notificationEmails" TEXT,
    "customTheme" TEXT,
    "bannerImage" TEXT,

    CONSTRAINT "FormSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormSettings_formId_key" ON "FormSettings"("formId");

-- AddForeignKey
ALTER TABLE "FormSettings" ADD CONSTRAINT "FormSettings_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
