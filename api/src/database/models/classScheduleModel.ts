import mongoose, { Schema, Document } from "mongoose";

export interface IRecurrence {
  type: "daily" | "weekly" | "monthly" | "custom";
  interval?: number; // e.g., every 2 weeks
  days?: number[]; // for weekly recurrence (0=Sun … 6=Sat)
  dates?: number[]; // for monthly recurrence (1–31)
  times: string[]; // multiple times per day ["09:00", "14:00"]
}

export interface IClassSchedule extends Document {
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  isRecurring: boolean;
  recurrence?: IRecurrence;
  createdAt: Date;
  updatedAt: Date;
}

const recurrenceSchema = new Schema<IRecurrence>(
  {
    type: {
      type: String,
      enum: ["daily", "weekly", "monthly", "custom"],
      required: true,
    },
    interval: { type: Number, default: 1 },
    days: [{ type: Number }], // weekly
    dates: [{ type: Number }], // monthly
    times: { type: [String], required: true }, // multiple slots per day
  },
  { _id: false },
);

const classScheduleSchema = new Schema<IClassSchedule>(
  {
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isRecurring: { type: Boolean, default: false },
    recurrence: { type: recurrenceSchema, required: false },
  },
  { timestamps: true },
);

export const ClassSchedule = mongoose.model<IClassSchedule>(
  "ClassSchedule",
  classScheduleSchema,
);
