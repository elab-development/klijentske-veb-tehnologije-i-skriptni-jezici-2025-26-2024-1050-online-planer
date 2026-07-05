export interface WeatherForecast {
  date: string;
  weatherCode: number;
  minTemperature: number;
  maxTemperature: number;
  precipitationProbability: number;
  windSpeed: number;
}

export type WeatherForecastsByDate = Record<string, WeatherForecast>;
