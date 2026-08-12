/*
  Warnings:

  - Made the column `prompt` on table `Generation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Generation" ALTER COLUMN "prompt" SET NOT NULL;
