import mongoose, { Schema, Document } from "mongoose";

export interface IClassType extends Document {
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const classTypeSchema = new Schema<IClassType>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const ClassType = mongoose.model<IClassType>(
  "ClassType",
  classTypeSchema,
);
