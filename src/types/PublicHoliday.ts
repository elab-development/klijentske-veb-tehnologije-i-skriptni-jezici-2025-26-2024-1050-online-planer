export type PublicHolidayType =
  | 'Public'
  | 'Bank'
  | 'School'
  | 'Authorities'
  | 'Optional'
  | 'Observance';

export interface PublicHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: PublicHolidayType[];
}

