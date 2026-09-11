-- CreateTable
CREATE TABLE "UserVoiceFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "voiceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserVoiceFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserVoiceFavorite_userId_voiceId_key" ON "UserVoiceFavorite"("userId", "voiceId");
