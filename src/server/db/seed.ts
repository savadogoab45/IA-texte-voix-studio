import {
  PrismaClient,
  VoiceProviderType,
  VoiceType,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const voices = [
    {
      name: "Alloy",
      provider: VoiceProviderType.OPENAI,
      providerVoiceId: "alloy",
      type: VoiceType.FREE,
      language: "fr",
      gender: null,
      description:
        "Voix polyvalente adaptée à la narration.",
    },

    {
      name: "Ash",
      provider: VoiceProviderType.OPENAI,
      providerVoiceId: "ash",
      type: VoiceType.FREE,
      language: "fr",
      gender: null,
      description:
        "Voix naturelle adaptée à la narration.",
    },

    {
      name: "Coral",
      provider: VoiceProviderType.OPENAI,
      providerVoiceId: "coral",
      type: VoiceType.FREE,
      language: "fr",
      gender: null,
      description:
        "Voix expressive pour les contenus narratifs.",
    },

    {
      name: "Echo",
      provider: VoiceProviderType.OPENAI,
      providerVoiceId: "echo",
      type: VoiceType.FREE,
      language: "fr",
      gender: null,
      description:
        "Voix adaptée aux contenus longs.",
    },

    {
      name: "Nova",
      provider: VoiceProviderType.OPENAI,
      providerVoiceId: "nova",
      type: VoiceType.FREE,
      language: "fr",
      gender: null,
      description:
        "Voix claire adaptée aux histoires et podcasts.",
    },

    {
      name: "Sage",
      provider: VoiceProviderType.OPENAI,
      providerVoiceId: "sage",
      type: VoiceType.FREE,
      language: "fr",
      gender: null,
      description:
        "Voix naturelle pour la narration.",
    },

    {
      name: "Shimmer",
      provider: VoiceProviderType.OPENAI,
      providerVoiceId: "shimmer",
      type: VoiceType.FREE,
      language: "fr",
      gender: null,
      description:
        "Voix douce adaptée aux contenus narratifs.",
    },
  ];

  for (const voice of voices) {
    const existingVoice = await prisma.voice.findFirst({
      where: {
        provider: voice.provider,
        providerVoiceId: voice.providerVoiceId,
        deletedAt: null,
      },
    });

    if (existingVoice) {
      await prisma.voice.update({
        where: {
          id: existingVoice.id,
        },
        data: {
          name: voice.name,
          provider: voice.provider,
          type: voice.type,
          language: voice.language,
          gender: voice.gender,
          description: voice.description,
          isActive: true,
          deletedAt: null,
        },
      });

      continue;
    }

    await prisma.voice.create({
      data: voice,
    });
  }

  console.log(
    `✅ ${voices.length} voix OpenAI disponibles.`,
  );
}

main()
  .catch((error) => {
    console.error(
      "❌ Erreur pendant le seed :",
      error,
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });