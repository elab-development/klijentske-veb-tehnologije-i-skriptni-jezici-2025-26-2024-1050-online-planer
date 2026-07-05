import { useEffect, useMemo, useState } from 'react';

import { weatherService } from '../services/WeatherService';
import type {
  WeatherForecast,
  WeatherForecastsByDate,
} from '../types/WeatherForecast';
import { toDateKey } from '../utils/plannerDate';

const getForecastsByDate = (forecasts: WeatherForecast[]) =>
  forecasts.reduce<WeatherForecastsByDate>(
    (groups, forecast) => ({
      ...groups,
      [forecast.date]: forecast,
    }),
    {},
  );

export const useWeatherForecast = (dates: Date[]) => {
  const [forecasts, setForecasts] = useState<WeatherForecastsByDate>({});
  const datesKey = useMemo(
    () => [...new Set(dates.map(toDateKey))].sort().join(','),
    [dates],
  );

  useEffect(() => {
    if (!datesKey) {
      return;
    }

    const controller = new AbortController();
    let isActive = true;

    const loadForecasts = async () => {
      try {
        const loadedForecasts = await weatherService.getDailyForecasts(16, {
          signal: controller.signal,
        });

        if (isActive) {
          setForecasts(getForecastsByDate(loadedForecasts));
        }
      } catch {
        if (isActive && !controller.signal.aborted) {
          setForecasts({});
        }
      }
    };

    void loadForecasts();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [datesKey]);

  return forecasts;
};
