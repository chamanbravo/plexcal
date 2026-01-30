import { useForm, useWatch } from "react-hook-form";
import { format } from "date-fns";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../../components/Modal";
import { useCreateClass } from "../../hooks/queries/useCreateClass";

const recurrenceSchema = z.object({
  type: z.enum(["daily", "weekly", "monthly", "custom"]),
  interval: z.coerce.number().min(1).default(1),
  days: z
    .array(z.string())
    .optional()
    .transform((arr) => arr?.map((d) => parseInt(d, 10))),
  dates: z
    .array(z.string())
    .optional()
    .transform((arr) => (arr ? arr.map(Number) : [])),
  times: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",").map((t) => t.trim()) : [])),
});

const formSchema = z
  .object({
    title: z.string().min(3, "Title is required").max(50, "Title too long"),
    classType: z.string().min(1, "Class type is required"),
    duration: z.coerce
      .number()
      .min(30, "Duration must be at least 30 minutes")
      .max(1000, "Duration too long"),
    instructor: z.string().min(3, "Instructor is required").max(50),
    isRecurring: z.boolean(),
    recurrence: recurrenceSchema.optional(),
    startDate: z.coerce.date(),
  })
  .superRefine((data, ctx) => {
    if (!data.isRecurring && !data.startDate) {
      ctx.addIssue({
        path: ["startDate"],
        message: "Start time is required for non-recurring classes",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.isRecurring) {
      if (!data.recurrence) {
        ctx.addIssue({
          path: ["recurrence"],
          message: "Recurrence details are required",
          code: z.ZodIssueCode.custom,
        });
        return;
      }

      if (
        data.recurrence.type === "weekly" &&
        (!data.recurrence.days || data.recurrence.days.length === 0)
      ) {
        ctx.addIssue({
          path: ["recurrence", "days"],
          message: "Select at least one weekday",
          code: z.ZodIssueCode.custom,
        });
      }

      if (
        data.recurrence.type === "monthly" &&
        (!data.recurrence.dates || data.recurrence.dates.length === 0)
      ) {
        ctx.addIssue({
          path: ["recurrence", "dates"],
          message: "Select at least one date",
          code: z.ZodIssueCode.custom,
        });
      }

      if (
        data.isRecurring &&
        (!data.recurrence.times || data.recurrence.times.length === 0)
      ) {
        ctx.addIssue({
          path: ["recurrence", "times"],
          message: "Add at least one time slot",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export type FormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ScheduleClassModal({ open, onClose }: Props) {
  const { mutateAsync: createClass, isPending } = useCreateClass();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      classType: "",
      duration: 60,
      instructor: "",
      isRecurring: false,
      recurrence: {
        type: "daily",
        interval: 1,
        times: "",
        days: [],
        dates: [],
      },
      startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    },
  });

  const formValues = useWatch({ control });

  const onSubmit = async (data: FormValues) => {
    try {
      await createClass(data);
      reset();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal open={open} title="Create Class" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <label>Class Title</label>
            <input
              placeholder="Class title"
              className="border rounded px-3 py-2 w-full"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="w-full">
            <label>Class Type</label>
            <select
              className="border rounded px-3 py-2 w-full"
              {...register("classType")}
            >
              <option value="">Select class type</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
            {errors.classType && (
              <p className="text-sm text-red-500">{errors.classType.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <label>Duration (minutes)</label>
            <input
              type="number"
              min={1}
              className="border rounded px-3 py-2 w-full"
              {...register("duration")}
            />
            {errors.duration && (
              <p className="text-sm text-red-500">{errors.duration.message}</p>
            )}
          </div>

          <div className="w-full">
            <label>Instructor</label>
            <input
              placeholder="Instructor"
              className="border rounded px-3 py-2 w-full"
              {...register("instructor")}
            />
            {errors.instructor && (
              <p className="text-sm text-red-500">
                {errors.instructor.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label>Start Time</label>
          <input
            type="datetime-local"
            className="border rounded px-3 py-2 w-full"
            {...register("startDate")}
          />
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate.message}</p>
          )}
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isRecurring")} />
          Recurring class
        </label>

        {formValues.isRecurring && (
          <div className="space-y-2">
            <label>Recurrence Type</label>
            <select
              className="border rounded px-3 py-2 w-full"
              {...register("recurrence.type")}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>

            {formValues.recurrence?.type === "weekly" && (
              <div>
                <label>Select weekdays:</label>
                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                  <label key={day}>
                    <input
                      type="checkbox"
                      value={day}
                      {...register(`recurrence.days`)}
                    />
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]}
                  </label>
                ))}
              </div>
            )}

            {formValues.recurrence?.type === "monthly" && (
              <div className="space-y-1">
                <label>Select dates of month</label>
                <select
                  multiple
                  className="border rounded px-3 py-2 w-full h-40"
                  {...register("recurrence.dates")}
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>

                {errors.recurrence?.dates && (
                  <p className="text-sm text-red-500">
                    {errors.recurrence.dates.message as string}
                  </p>
                )}
              </div>
            )}

            {formValues.recurrence?.type === "custom" && (
              <div className="space-y-3">
                <div>
                  <label>Repeat every</label>
                  <input
                    type="number"
                    min={1}
                    className="border rounded px-3 py-2 w-full"
                    {...register("recurrence.interval")}
                  />
                  <p className="text-xs text-gray-500">Weeks</p>
                </div>

                <div>
                  <label>Select weekdays</label>
                  <div className="flex flex-wrap gap-3">
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                      <label key={day} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          value={day}
                          {...register("recurrence.days")}
                        />
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]}
                      </label>
                    ))}
                  </div>
                  {errors.recurrence?.days && (
                    <p className="text-sm text-red-500">
                      {errors.recurrence.days.message as string}
                    </p>
                  )}
                </div>
              </div>
            )}

            <label>Times (HH:mm)</label>
            <input
              placeholder="09:00,14:00"
              className="border rounded px-3 py-2 w-full"
              {...register("recurrence.times")}
            />
            {errors.recurrence?.times && (
              <p className="text-sm text-red-500">
                {errors.recurrence.times.message as string}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded"
          >
            {isPending ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
