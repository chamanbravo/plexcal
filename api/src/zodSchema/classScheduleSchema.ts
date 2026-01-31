import { z } from "zod";
import { isValidTime24 } from "../utils/validateTime";

const recurrenceSchema = z
  .object({
    type: z.enum(["daily", "weekly", "monthly", "custom"]),
    interval: z.number().min(1).optional().default(1),
    days: z.array(z.number()).optional(),
    dates: z.array(z.number()).optional(),
    times: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.times && data.times.length > 0) {
      const invalidTimes = data.times.filter((t) => !isValidTime24(t));

      if (invalidTimes.length > 0) {
        ctx.addIssue({
          path: ["times"],
          message:
            "Invalid time format. Use HH:MM (1–24), e.g. 9:00, 14:00, 24:00",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export const createClassScheduleSchema = z.object({
  title: z.string().min(3, "Title is required").max(20, "Title is too long"),
  classType: z.string().min(1, "Class type is required"),
  duration: z.coerce
    .number()
    .min(30, "Duration must be at least 30 minute")
    .max(100, "Duration must be at most 100 minutes"),
  instructor: z
    .string()
    .min(3, "Instructor name is required")
    .max(20, "Instructor name is too long"),
  isRecurring: z.boolean(),
  startDate: z.coerce.date({
    error: (iss) =>
      iss.input === undefined ? "Start time is required" : "Invalid start time",
  }),
  recurrence: recurrenceSchema,
});
