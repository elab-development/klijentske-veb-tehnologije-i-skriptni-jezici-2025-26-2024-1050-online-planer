import type { WeatherForecast } from '../types/WeatherForecast';

interface WeatherServiceOptions {
  baseUrl?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

interface FetchWeatherOptions {
  signal?: AbortSignal;
}

interface OpenMeteoDailyResponse {
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
    wind_speed_10m_max?: number[];
  };
}

const defaultLatitude = 44.8125;
const defaultLongitude = 20.4612;
const defaultTimezone = 'Europe/Belgrade';

const normalizeNumber = (value: number | undefined) =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0;

const normalizeForecasts = (
  response: OpenMeteoDailyResponse,
): WeatherForecast[] => {
  const daily = response.daily;

  if (!daily?.time?.length) {
    return [];
  }

  return daily.time.map((date, index) => ({
    date,
    weatherCode: normalizeNumber(daily.weather_code?.[index]),
    minTemperature: normalizeNumber(daily.temperature_2m_min?.[index]),
    maxTemperature: normalizeNumber(daily.temperature_2m_max?.[index]),
    precipitationProbability: normalizeNumber(
      daily.precipitation_probability_max?.[index],
    ),
    windSpeed: normalizeNumber(daily.wind_speed_10m_max?.[index]),
  }));
};

export class WeatherService {
  private baseUrl: string;
  private latitude: number;
  private longitude: number;
  private timezone: string;
  private cache = new Map<string, WeatherForecast[]>();

  constructor(options: WeatherServiceOptions = {}) {
    this.baseUrl = options.baseUrl ?? 'https://api.open-meteo.com/v1';
    this.latitude = options.latitude ?? defaultLatitude;
    this.longitude = options.longitude ?? defaultLongitude;
    this.timezone = options.timezone ?? defaultTimezone;
  }

  async getDailyForecasts(
    forecastDays = 16,
    options: FetchWeatherOptions = {},
  ) {
    const cacheKey = `${this.latitude}-${this.longitude}-${this.timezone}-${forecastDays}`;
    const cachedForecasts = this.cache.get(cacheKey);

    if (cachedForecasts) {
      return cachedForecasts;
    }

    const params = new URLSearchParams({
      latitude: String(this.latitude),
      longitude: String(this.longitude),
      timezone: this.timezone,
      forecast_days: String(forecastDays),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_probability_max',
        'wind_speed_10m_max',
      ].join(','),
    });

    const response = await fetch(`${this.baseUrl}/forecast?${params}`, {
      signal: options.signal,
    });

    if (!response.ok) {
      throw new Error('Prognoza trenutno nije dostupna.');
    }

    const data = (await response.json()) as OpenMeteoDailyResponse;
    const forecasts = normalizeForecasts(data);
    this.cache.set(cacheKey, forecasts);

    return forecasts;
  }
}

export const weatherService = new WeatherService();
