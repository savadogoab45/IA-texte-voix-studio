import { TRPCError } from "@trpc/server";

import type { VoiceDto } from "../dtos/voice.dto";
import { VoiceMapper } from "../mappers/voice.mapper";
import { VoiceRepository } from "../repositories/voice.repository";

import type { CreateVoiceInput } from "../validators/create-voice.validator";
import type { UpdateVoiceInput } from "../validators/update-voice.validator";

export class VoiceService {
  constructor(private readonly voiceRepository: VoiceRepository) {}

  async getAll(): Promise<VoiceDto[]> {
    const voices = await this.voiceRepository.findAll();

    return voices.map((voice) => VoiceMapper.toDto(voice));
  }

  async getById(id: string): Promise<VoiceDto> {
    const voice = await this.voiceRepository.findById(id);

    if (!voice) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Voix introuvable.",
      });
    }

    return VoiceMapper.toDto(voice);
  }

  async getByProvider(
    provider: CreateVoiceInput["provider"],
  ): Promise<VoiceDto[]> {
    const voices = await this.voiceRepository.findByProvider(provider);

    return voices.map((voice) => VoiceMapper.toDto(voice));
  }

  async getFreeVoices(): Promise<VoiceDto[]> {
    const voices = await this.voiceRepository.findFree();

    return voices.map((voice) => VoiceMapper.toDto(voice));
  }

  async getPremiumVoices(): Promise<VoiceDto[]> {
    const voices = await this.voiceRepository.findPremium();

    return voices.map((voice) => VoiceMapper.toDto(voice));
  }

  async create(data: CreateVoiceInput): Promise<VoiceDto> {
    const existing = await this.voiceRepository.findByProviderVoiceId(
      data.providerVoiceId,
    );

    if (existing) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Cette voix existe déjà.",
      });
    }

    const voice = await this.voiceRepository.create(data);

    return VoiceMapper.toDto(voice);
  }

  async update(id: string, data: UpdateVoiceInput): Promise<VoiceDto> {
    const voice = await this.voiceRepository.findById(id);

    if (!voice) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Voix introuvable.",
      });
    }

    const updated = await this.voiceRepository.update(id, data);

    return VoiceMapper.toDto(updated);
  }

  async delete(id: string): Promise<void> {
    const voice = await this.voiceRepository.findById(id);

    if (!voice) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Voix introuvable.",
      });
    }

    await this.voiceRepository.delete(id);

    if (await this.voiceRepository.isUsed(id)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cette voix est utilisée par une ou plusieurs générations.",
      });
    }
  }

  async restore(id: string): Promise<VoiceDto> {
    const voice = await this.voiceRepository.findById(id);

    if (!voice) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Voix introuvable.",
      });
    }

    const restored = await this.voiceRepository.restore(id);

    return VoiceMapper.toDto(restored);
  }
}
