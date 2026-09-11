-- AlterEnum
ALTER TYPE "VoiceProviderType" ADD VALUE 'EDGE_TTS';

-- AlterTable
ALTER TABLE "Generation" ADD COLUMN     "previewUrl" TEXT;

-- AlterTable
ALTER TABLE "Voice" ADD COLUMN     "previewUrl" TEXT;
