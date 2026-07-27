import { z } from "zod";

export const trainingSessionCancellationSchema = z.object({
  trainingSessionId: z.string().trim().min(1),
  confirmation: z.literal("ABORT"),
});

export const trainingSessionDeletionSchema = z.object({
  trainingSessionId: z.string().trim().min(1),
  confirmation: z.literal("DELETE"),
});
