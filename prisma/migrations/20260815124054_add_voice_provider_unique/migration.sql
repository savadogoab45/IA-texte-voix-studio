/*
  Warnings:

  - You are about to drop the column `provider` on the `Generation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Voice_provider_providerVoiceId_key";

-- AlterTable
ALTER TABLE "Generation" DROP COLUMN "provider",
ADD COLUMN     "providerAi" "AIProviderType",
ADD COLUMN     "providerVoice" "VoiceProviderType";
