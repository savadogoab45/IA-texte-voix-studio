import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { VoiceRepository } from "../repositories/voice.repository";
import { VoiceService } from "../services/voice.service";

import { createVoiceValidator } from "../validators/create-voice.validator";

import { updateVoiceValidator } from "../validators/update-voice.validator";

import { z } from "zod";

const voiceService = new VoiceService(new VoiceRepository());

export const voiceRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    return voiceService.getAll();
  }),

  getById: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return voiceService.getById(input);
  }),

  getByProvider: protectedProcedure
    .input(
      z.object({
        provider: createVoiceValidator.shape.provider,
      }),
    )
    .query(async ({ input }) => {
      return voiceService.getByProvider(input.provider);
    }),

  getFree: protectedProcedure.query(async () => {
    return voiceService.getFreeVoices();
  }),

  getPremium: protectedProcedure.query(async () => {
    return voiceService.getPremiumVoices();
  }),

  create: protectedProcedure
    .input(createVoiceValidator)
    .mutation(async ({ input }) => {
      return voiceService.create(input);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: updateVoiceValidator,
      }),
    )
    .mutation(async ({ input }) => {
      return voiceService.update(input.id, input.data);
    }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    await voiceService.delete(input);

    return {
      success: true,
    };
  }),

  restore: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    return voiceService.restore(input);
  }),
});
