/*
  Warnings:

  - A unique constraint covering the columns `[provider,providerVoiceId]` on the table `Voice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Voice_provider_providerVoiceId_key" ON "Voice"("provider", "providerVoiceId");
