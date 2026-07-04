import type { PublicHoliday } from '../types/PublicHoliday';

export type HolidaysByDate = Record<string, PublicHoliday[]>;

export const getHolidayYears = (dates: Date[]) =>
  [...new Set(dates.map((date) => date.getFullYear()))].sort((a, b) => a - b);

export const getHolidaysByDate = (holidays: PublicHoliday[]) =>
  holidays.reduce<HolidaysByDate>(
    (groups, holiday) => ({
      ...groups,
      [holiday.date]: [...(groups[holiday.date] ?? []), holiday],
    }),
    {},
  );

