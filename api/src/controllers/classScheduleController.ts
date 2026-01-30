import { Request, Response } from "express";
import {
  ClassSchedule,
  IClassSchedule,
} from "../database/models/classScheduleModel";
import { successResponse } from "../utils/successResponse";
import { errorResponse } from "../utils/errorResponse";
import { addDays, getDay, getDate, setHours, setMinutes } from "date-fns";

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

const parseTime = (baseDate: Date, time: string) => {
  const [h, m] = time.split(":").map(Number);
  return setMinutes(setHours(baseDate, h), m);
};

const expandSchedule = (schedule: any, rangeStart: Date, rangeEnd: Date) => {
  const events: any[] = [];

  // NON-RECURRING
  if (!schedule.isRecurring) {
    const start = new Date(schedule.startDate);
    if (start >= rangeStart && start <= rangeEnd) {
      events.push({
        id: schedule._id,
        title: schedule.title,
        start,
      });
    }
    return events;
  }

  const { recurrence } = schedule;

  // IMPORTANT: start cursor from max(schedule.startDate, rangeStart)
  let cursor = new Date(
    new Date(schedule.startDate) > rangeStart ? schedule.startDate : rangeStart,
  );

  while (cursor <= rangeEnd) {
    // DAILY
    if (recurrence.type === "daily") {
      recurrence.times.forEach((time: string) => {
        const start = parseTime(cursor, time);

        if (start >= rangeStart && start <= rangeEnd) {
          events.push({
            id: `${schedule._id}-${start.toISOString()}`,
            title: schedule.title,
            start,
          });
        }
      });

      cursor = addDays(cursor, recurrence.interval || 1);
      continue;
    }

    // WEEKLY
    if (recurrence.type === "weekly") {
      if (recurrence.days.includes(getDay(cursor))) {
        recurrence.times.forEach((time: string) => {
          const start = parseTime(cursor, time);
          if (start >= rangeStart && start <= rangeEnd) {
            events.push({
              id: `${schedule._id}-${start.toISOString()}`,
              title: schedule.title,
              start,
            });
          }
        });
      }
      cursor = addDays(cursor, 1);
      continue;
    }

    // MONTHLY
    if (recurrence.type === "monthly") {
      if (recurrence.dates.includes(getDate(cursor))) {
        recurrence.times.forEach((time: string) => {
          const start = parseTime(cursor, time);
          if (start >= rangeStart && start <= rangeEnd) {
            events.push({
              id: `${schedule._id}-${start.toISOString()}`,
              title: schedule.title,
              start,
            });
          }
        });
      }
      cursor = addDays(cursor, 1);
      continue;
    }

    // CUSTOM (future)
    if (recurrence.type === "custom") {
      // Match days
      if (recurrence.days?.includes(getDay(cursor))) {
        recurrence.times.forEach((time: string) => {
          const start = parseTime(cursor, time);
          if (start >= rangeStart && start <= rangeEnd) {
            events.push({ id: schedule._id, title: schedule.title, start });
          }
        });
      }

      // Match dates
      if (recurrence.dates?.includes(getDate(cursor))) {
        recurrence.times.forEach((time: string) => {
          const start = parseTime(cursor, time);
          if (start >= rangeStart && start <= rangeEnd) {
            events.push({ id: schedule._id, title: schedule.title, start });
          }
        });
      }

      // Daily interval fallback
      if (!recurrence.days && !recurrence.dates) {
        recurrence.times.forEach((time: string) => {
          const start = parseTime(cursor, time);
          if (start >= rangeStart && start <= rangeEnd) {
            events.push({ id: schedule._id, title: schedule.title, start });
          }
        });
      }

      cursor = addDays(cursor, recurrence.interval || 1);
      continue;
    }
  }

  return events;
};

export const getClassSchedules = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, page = "1", limit = "10" } = req.query;

    if (!startDate || !endDate) {
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      const [schedules, total] = await Promise.all([
        ClassSchedule.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        ClassSchedule.countDocuments(),
      ]);

      return res.status(200).json(
        successResponse({
          title: "Class Schedules",
          message: "Class Schedules objects",
          data: schedules.map((schedule) => ({
            id: schedule._id,
            title: schedule.title,
            startDate: schedule.startDate,
            isRecurring: schedule.isRecurring,
            recurrenceType: schedule.recurrence?.type,
          })),
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
          },
        }),
      );
    }

    const rangeStart = new Date(startDate as string);
    const rangeEnd = new Date(endDate as string);

    const schedules = await ClassSchedule.find().sort({ createdAt: -1 }).lean();
    const events = schedules.flatMap((schedule) =>
      expandSchedule(schedule, rangeStart, rangeEnd),
    );

    return res.status(200).json({
      title: "Class schedules",
      message: "Expanded class schedules fetched successfully",
      data: events,
    });
  } catch (err: any) {
    return res.status(500).json({
      title: "Server Error",
      message: "Failed to fetch schedules",
      errors: err,
    });
  }
};

export const deleteClassSchedule = async (req: Request, res: Response) => {
  try {
    const classSchedule = await ClassSchedule.findByIdAndDelete(req.params.id);

    if (!classSchedule) {
      return res.status(404).json(
        errorResponse({
          title: "Not Found",
          message: "Class schedule not found",
          errors: [{ field: "id", message: "Class schedule does not exist" }],
        }),
      );
    }

    return res.json(
      successResponse({
        title: "Class schedule deleted",
        message: "Class schedule removed successfully",
        data: {},
      }),
    );
  } catch (err: any) {
    return res.status(500).json({
      title: "Server Error",
      message: "Failed to delete schedule",
      errors: err,
    });
  }
};
