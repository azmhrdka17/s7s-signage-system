-- AlterTable
ALTER TABLE "SignageContent" ADD COLUMN "layoutConfig" TEXT NOT NULL DEFAULT '{}';
ALTER TABLE "SignageContent" ADD COLUMN "videoMode" TEXT NOT NULL DEFAULT 'video';
ALTER TABLE "SignageContent" ADD COLUMN "slideDuration" INTEGER NOT NULL DEFAULT 5;
