import { z } from "zod";

export const createClassTypeSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});
