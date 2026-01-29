import mongoose, { Schema, Document } from "mongoose";

export interface IClassSchedule extends Document {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isRecurring: boolean;
  recurrence?: {
    type: "daily" | "weekly" | "monthly" | "custom";
    days?: number[]; // For weekly (0=Sun,6=Sat)
    dates?: number[]; // For monthly
    interval?: number; // e.g., every 2 weeks
    times?: string[]; // ["09:00", "14:00"]
    customRule?: any; // Flexible for advanced rules
  };
  createdAt: Date;
  updatedAt: Date;
}

const classScheduleSchema = new Schema<IClassSchedule>(
  {
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isRecurring: { type: Boolean, default: false },
    recurrence: { type: Object },
  },
  { timestamps: true },
);

export const ClassSchedule = mongoose.model<IClassSchedule>(
  "ClassSchedule",
  classScheduleSchema,
);
