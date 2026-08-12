import type { Prisma, Voice } from "@prisma/client";

import { db } from "@/server/db";

export class VoiceRepository {
  async findAll(): Promise<Voice[]> {
    return db.voice.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string): Promise<Voice | null> {
    return db.voice.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findByProvider(
    provider: Prisma.VoiceWhereInput["provider"],
  ): Promise<Voice[]> {
    return db.voice.findMany({
      where: {
        provider,
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async create(data: Prisma.VoiceCreateInput): Promise<Voice> {
    return db.voice.create({
      data,
    });
  }

  async update(id: string, data: Prisma.VoiceUpdateInput): Promise<Voice> {
    return db.voice.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string): Promise<Voice> {
    return db.voice.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(id: string): Promise<Voice> {
    return db.voice.update({
      where: {
        id,
      },
      data: {
        deletedAt: null,
      },
    });
  }

  async findByProviderVoiceId(providerVoiceId: string): Promise<Voice | null> {
    return db.voice.findFirst({
      where: {
        providerVoiceId,
        deletedAt: null,
      },
    });
  }

  async findActive(): Promise<Voice[]> {
    return db.voice.findMany({
      where: {
        deletedAt: null,
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findPremium(): Promise<Voice[]> {
    return db.voice.findMany({
      where: {
        deletedAt: null,
        type: "PREMIUM",
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findFree(): Promise<Voice[]> {
    return db.voice.findMany({
      where: {
        deletedAt: null,
        type: "FREE",
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }
  async isUsed(id: string): Promise<boolean> {
    const count = await db.generation.count({
      where: {
        voiceId: id,
      },
    });

    return count > 0;
  }
}
