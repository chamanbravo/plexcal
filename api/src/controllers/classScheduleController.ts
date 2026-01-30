import { Request, Response } from "express";
import {
  ClassSchedule,
  IClassSchedule,
} from "../database/models/classScheduleModel";
import { successResponse } from "../utils/successResponse";
import { errorResponse } from "../utils/errorResponse";

export const createClassSchedules = async (req: Request, res: Response) => {
  try {
    const data: Partial<IClassSchedule> = req.body;
    const newClassSchedule = new ClassSchedule(data);
    await newClassSchedule.save();
    return res.status(201).json(
      successResponse({
        title: "Class schedule created",
        message: "Class schedule added successfully",
        data: newClassSchedule,
      }),
    );
  } catch (err: any) {
    return res.status(400).json(
      errorResponse({
        title: "Server Error",
        message: "Something went wrong",
        errors: err,
      }),
    );
  }
};

export const getClassSchedules = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      ClassSchedule.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      ClassSchedule.countDocuments(),
    ]);

    return res.status(201).json(
      successResponse({
        title: "Class schedule created",
        message: "Class schedule added successfully",
        data: data.map((schedule) => ({
          id: schedule._id,
          title: schedule.title,
          start: new Date(schedule.startDate).toISOString(),
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }),
    );
  } catch (err: any) {
    res.status(400).json(
      errorResponse({
        title: "Server Error",
        message: "Something went wrong",
        errors: err,
      }),
    );
  }
};
