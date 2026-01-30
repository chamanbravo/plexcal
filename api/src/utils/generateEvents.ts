import { addDays, getDay, getDate, setHours, setMinutes } from "date-fns";

export const parseTime = (baseDate: Date, time: string) => {
  const [h, m] = time.split(":").map(Number);
  return setMinutes(setHours(baseDate, h), m);
};

export const expandSchedule = (
  schedule: any,
  rangeStart: Date,
  rangeEnd: Date,
) => {
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

    // CUSTOM
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
