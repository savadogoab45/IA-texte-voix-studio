/*
  Warnings:

  - You are about to drop the `generation` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AIProviderType" AS ENUM ('OPENAI', 'GEMINI', 'ANTHROPIC');

-- DropForeignKey
ALTER TABLE "generation" DROP CONSTRAINT "generation_documentId_fkey";

-- DropTable
DROP TABLE "generation";

-- DropEnum
DROP TYPE "AIProvider";

-- CreateTable
CREATE TABLE "Generation" (
    "id" TEXT NOT NULL,
    "prompt" TEXT,
    "result" TEXT,
    "provider" "AIProviderType" NOT NULL,
    "status" "GenerationStatus" NOT NULL,
    "voiceId" TEXT,
    "audioUrl" TEXT,
    "duration" INTEGER,
    "error" TEXT,
    "documentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Generation" ADD CONSTRAINT "Generation_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
