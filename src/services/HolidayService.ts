import type { PublicHoliday, PublicHolidayType } from '../types/PublicHoliday';

interface HolidayServiceOptions {
  baseUrl?: string;
  countryCode?: string;
}

interface FetchHolidaysOptions {
  signal?: AbortSignal;
}

interface HolidayApiResponse {
  date?: string;
  localName?: string;
  name?: string;
  countryCode?: string;
  fixed?: boolean;
  global?: boolean;
  counties?: string[] | null;
  launchYear?: number | null;
  types?: PublicHolidayType[];
}

const defaultCountryCode = 'RS';

const byHolidayDate = (a: PublicHoliday, b: PublicHoliday) =>
  a.date.localeCompare(b.date);

const normalizeHoliday = (holiday: HolidayApiResponse): PublicHoliday => ({
  date: holiday.date ?? '',
  localName: holiday.localName ?? holiday.name ?? 'Praznik',
  name: holiday.name ?? holiday.localName ?? 'Holiday',
  countryCode: holiday.countryCode ?? defaultCountryCode,
  fixed: holiday.fixed ?? false,
  global: holiday.global ?? true,
  counties: holiday.counties ?? null,
  launchYear: holiday.launchYear ?? null,
  types: holiday.types ?? [],
});

export class HolidayService {
  private baseUrl: string;
  private countryCode: string;
  private cache = new Map<string, PublicHoliday[]>();

  constructor(options: HolidayServiceOptions = {}) {
    this.baseUrl = options.baseUrl ?? 'https://date.nager.at/api/v3';
    this.countryCode = options.countryCode ?? defaultCountryCode;
  }

  async getPublicHolidays(
    year: number,
    countryCode = this.countryCode,
    options: FetchHolidaysOptions = {},
  ) {
    const normalizedCountryCode = countryCode.toUpperCase();
    const cacheKey = `${year}-${normalizedCountryCode}`;
    const cachedHolidays = this.cache.get(cacheKey);

    if (cachedHolidays) {
      return cachedHolidays;
    }

    const response = await fetch(
      `${this.baseUrl}/PublicHolidays/${year}/${normalizedCountryCode}`,
      { signal: options.signal },
    );

    if (!response.ok) {
      throw new Error(`Praznici nisu dostupni za ${normalizedCountryCode}.`);
    }

    const data = (await response.json()) as HolidayApiResponse[];
    const holidays = data.map(normalizeHoliday).sort(byHolidayDate);
    this.cache.set(cacheKey, holidays);

    return holidays;
  }

  async getPublicHolidaysForYears(
    years: number[],
    countryCode = this.countryCode,
    options: FetchHolidaysOptions = {},
  ) {
    const uniqueYears = [...new Set(years)].sort((a, b) => a - b);
    const holidayGroups = await Promise.all(
      uniqueYears.map((year) =>
        this.getPublicHolidays(year, countryCode, options),
      ),
    );

    return holidayGroups.flat().sort(byHolidayDate);
  }
}

export const holidayService = new HolidayService();

