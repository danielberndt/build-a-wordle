import getDayOfYear from "date-fns/getDayOfYear";
import getISOWeek from "date-fns/getISOWeek";
import getISOWeekYear from "date-fns/getISOWeekYear";
import getMonth from "date-fns/getMonth";
import getYear from "date-fns/getYear";

export const getYearWeekKey = (d: Date) => {
  const week = getISOWeek(d);
  const weekYear = getISOWeekYear(d);
  return `${weekYear}-${week}`;
};

export const getYearDayKey = (d: Date) => {
  const year = getYear(d);
  const dayOfYear = getDayOfYear(d);
  return `${year}-${dayOfYear}`;
};

export const getYearMonthKey = (d: Date) => {
  const year = getYear(d);
  const month = getMonth(d);
  return `${year}-${month}`;
};

export const getYearKey = (d: Date) => {
  return `${getYear(d)}`;
};
