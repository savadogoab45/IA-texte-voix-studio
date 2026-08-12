import { db } from "./index";
import { VoiceProviderType, VoiceType } from "@prisma/client";

async function main() {
  await db.voice.createMany({
    data: [
      {
        name: "Alloy",
        provider: VoiceProviderType.OPENAI,
        providerVoiceId: "alloy",
        type: VoiceType.FREE,
        language: "fr",
        gender: "neutral",
      },
      {
        name: "Echo",
        provider: VoiceProviderType.OPENAI,
        providerVoiceId: "echo",
        type: VoiceType.FREE,
        language: "fr",
        gender: "male",
      },
      {
        name: "Nova",
        provider: VoiceProviderType.OPENAI,
        providerVoiceId: "nova",
        type: VoiceType.PREMIUM,
        language: "fr",
        gender: "female",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Voix créées");
}

main()
  .catch(console.error)
  .finally(async () => {
    await db.$disconnect();
  });
