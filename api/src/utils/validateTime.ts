import { expandSchedule } from "./generateEvents";

export const isValidTime24 = (time: string) => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) return false;

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (hour < 1 || hour > 24) return false;
  if (minute < 0 || minute > 59) return false;

  if (hour === 24 && minute !== 0) return false;

  return true;
};

export const buildDateTime = (date: string, time: string) => {
  const d = new Date(date);
  const [hours, minutes] = time.split(":").map(Number);
  d.setHours(hours, minutes, 0, 0);
  return d;
};

const addDuration = (start: Date, minutes = 60) => {
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + minutes);
  return end;
};

export const expandScheduleWithEnd = (
  schedule: any,
  rangeStart: Date,
  rangeEnd: Date,
) => {
  const occurrences = expandSchedule(schedule, rangeStart, rangeEnd);

  return occurrences.map((event) => ({
    start: event.start,
    end: addDuration(event.start),
    scheduleId: schedule._id,
  }));
};

export const hasCollision = (
  a: { start: Date; end: Date },
  b: { start: Date; end: Date },
) => {
  return a.start < b.end && a.end > b.start;
};
