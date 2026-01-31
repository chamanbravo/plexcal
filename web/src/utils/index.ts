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
