import type { PlannerEvent } from '../models/PlannerEvent';
import type { PlannerView } from './plannerTypes';

export const dayFormatter = new Intl.DateTimeFormat('sr-Latn-RS', {
  day: 'numeric',
  month: 'long',
  weekday: 'long',
  year: 'numeric',
});

export const shortDateFormatter = new Intl.DateTimeFormat('sr-Latn-RS', {
  day: 'numeric',
  month: 'short',
});

export const monthFormatter = new Intl.DateTimeFormat('sr-Latn-RS', {
  month: 'long',
  year: 'numeric',
});

export const weekdayFormatter = new Intl.DateTimeFormat('sr-Latn-RS', {
  weekday: 'short',
});

const timeFormatter = new Intl.DateTimeFormat('sr-Latn-RS', {
  hour: '2-digit',
  minute: '2-digit',
});

export const monthWeekdays = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];

const padDatePart = (value: number) => value.toString().padStart(2, '0');

export const toDateKey = (date: Date) =>
  [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join('-');

export const toDateTimeLocalValue = (date: Date, time = '09:00') =>
  `${toDateKey(date)}T${time}`;

export const parseEventDate = (event: PlannerEvent) =>
  new Date(event.dateTime);

export const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

export const addMonths = (date: Date, months: number) => {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
};

export const startOfWeek = (date: Date) => {
  const day = date.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  return addDays(startOfDay(date), -daysFromMonday);
};

export const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

export const getWeekDays = (date: Date) => {
  const weekStart = startOfWeek(date);
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
};

export const getMonthGridDays = (date: Date) => {
  const gridStart = startOfWeek(startOfMonth(date));
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
};

const getRangeTitle = (startDate: Date, endDate: Date) =>
  `${shortDateFormatter.format(startDate)} - ${shortDateFormatter.format(
    endDate,
  )}`;

export const getEventTime = (event: PlannerEvent) =>
  timeFormatter.format(parseEventDate(event));

export const getPlannerTitle = (view: PlannerView, referenceDate: Date) => {
  if (view === 'daily') {
    return dayFormatter.format(referenceDate);
  }

  if (view === 'weekly') {
    const weekDays = getWeekDays(referenceDate);
    return getRangeTitle(weekDays[0], weekDays[6]);
  }

  return monthFormatter.format(referenceDate);
};
