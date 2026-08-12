-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "AIProvider" AS ENUM ('OPENAI', 'GEMINI', 'ANTHROPIC');

-- CreateTable
CREATE TABLE "generation" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "status" "GenerationStatus" NOT NULL DEFAULT 'PENDING',
    "provider" "AIProvider" NOT NULL,
    "result" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "documentId" TEXT NOT NULL,

    CONSTRAINT "generation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "generation_documentId_idx" ON "generation"("documentId");

-- AddForeignKey
ALTER TABLE "generation" ADD CONSTRAINT "generation_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
