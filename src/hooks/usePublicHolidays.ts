import { useEffect, useMemo, useState } from 'react';

import { holidayService } from '../services/HolidayService';
import type { PublicHoliday } from '../types/PublicHoliday';

const defaultCountryCode = 'RS';

export const usePublicHolidays = (
  years: number[],
  countryCode = defaultCountryCode,
) => {
  const [holidays, setHolidays] = useState<PublicHoliday[]>([]);
  const yearsKey = useMemo(
    () => [...new Set(years)].sort((a, b) => a - b).join(','),
    [years],
  );

  useEffect(() => {
    const visibleYears = yearsKey
      .split(',')
      .filter(Boolean)
      .map((year) => Number(year));

    const controller = new AbortController();
    let isActive = true;

    const loadHolidays = async () => {
      try {
        const loadedHolidays = await holidayService.getPublicHolidaysForYears(
          visibleYears,
          countryCode,
          { signal: controller.signal },
        );

        if (isActive) {
          setHolidays(loadedHolidays);
        }
      } catch {
        if (isActive && !controller.signal.aborted) {
          setHolidays([]);
        }
      }
    };

    void loadHolidays();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [countryCode, yearsKey]);

  return holidays;
};

