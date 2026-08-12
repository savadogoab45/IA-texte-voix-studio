/*
  Warnings:

  - Added the required column `title` to the `Generation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Generation" ADD COLUMN     "currentStep" TEXT,
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "transcript" TEXT;
