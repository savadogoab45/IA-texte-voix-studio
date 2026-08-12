-- CreateEnum
CREATE TYPE "VoiceType" AS ENUM ('FREE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "VoiceProviderType" AS ENUM ('MICROSOFT', 'GOOGLE', 'OPENAI', 'ELEVENLABS', 'MINIMAX');

-- CreateTable
CREATE TABLE "Voice" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" "VoiceProviderType" NOT NULL,
    "providerVoiceId" TEXT NOT NULL,
    "type" "VoiceType" NOT NULL,
    "language" TEXT NOT NULL,
    "gender" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Voice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Generation" ADD CONSTRAINT "Generation_voiceId_fkey" FOREIGN KEY ("voiceId") REFERENCES "Voice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
