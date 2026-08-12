/*
  Warnings:

  - You are about to drop the column `completedAt` on the `Generation` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `Generation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Generation" DROP COLUMN "completedAt",
DROP COLUMN "startedAt";
