import { z } from "zod";

export const createApplicationSchema = z.object({
  jobUrl: z.string().url(),
});

export type CreateApplicationRequest = z.infer<
  typeof createApplicationSchema
>;