import {
  FaCloud,
  FaCloudRain,
  FaCloudSun,
  FaSnowflake,
  FaSun,
  FaTint,
  FaWind,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

import type { WeatherForecast } from '../../types/WeatherForecast';

interface WeatherForecastBadgeProps {
  forecast?: WeatherForecast;
  compact?: boolean;
}

interface WeatherMeta {
  label: string;
  icon: IconType;
  className: string;
}

const getWeatherMeta = (weatherCode: number): WeatherMeta => {
  if (weatherCode === 0) {
    return {
      label: 'Vedro',
      icon: FaSun,
      className: 'bg-amber-50 text-amber-600',
    };
  }

  if ([1, 2, 3].includes(weatherCode)) {
    return {
      label: 'Promenljivo',
      icon: FaCloudSun,
      className: 'bg-sky-50 text-sky-600',
    };
  }

  if ([45, 48].includes(weatherCode)) {
    return {
      label: 'Magla',
      icon: FaCloud,
      className: 'bg-slate-100 text-slate-500',
    };
  }

  if (weatherCode >= 71 && weatherCode <= 86) {
    return {
      label: 'Sneg',
      icon: FaSnowflake,
      className: 'bg-cyan-50 text-cyan-600',
    };
  }

  if (
    (weatherCode >= 51 && weatherCode <= 67) ||
    (weatherCode >= 80 && weatherCode <= 99)
  ) {
    return {
      label: 'Padavine',
      icon: FaCloudRain,
      className: 'bg-indigo-50 text-indigo-600',
    };
  }

  return {
    label: 'Prognoza',
    icon: FaCloudSun,
    className: 'bg-indigo-50 text-indigo-600',
  };
};

const formatTemperature = (temperature: number) => `${Math.round(temperature)}°`;
const formatWind = (windSpeed: number) => `${Math.round(windSpeed)} km/h`;

const WeatherForecastBadge = ({
  compact = false,
  forecast,
}: WeatherForecastBadgeProps) => {
  if (!forecast) {
    if (compact) {
      return (
        <div className='mt-2 flex min-w-0 items-center gap-2 rounded-lg bg-slate-100 px-2 py-1.5 text-xs font-semibold text-slate-400'>
          <FaCloud aria-hidden='true' className='shrink-0 text-[13px]' />
          <span className='truncate'>Prognoza nije dostupna</span>
        </div>
      );
    }

    return (
      <div className='mb-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-slate-400'>
        <div className='flex items-center gap-3'>
          <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-sm'>
            <FaCloud aria-hidden='true' />
          </span>
          <div>
            <p className='text-sm font-bold'>Prognoza nije dostupna</p>
            <p className='text-xs font-semibold'>
              Open-Meteo vraća prognozu samo za naredne dane.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const weatherMeta = getWeatherMeta(forecast.weatherCode);
  const Icon = weatherMeta.icon;

  if (compact) {
    return (
      <div
        className={[
          'mt-2 flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold',
          weatherMeta.className,
        ].join(' ')}
        title={`${weatherMeta.label}, ${formatTemperature(
          forecast.minTemperature,
        )}/${formatTemperature(forecast.maxTemperature)}, kiša ${
          forecast.precipitationProbability
        }%`}
      >
        <Icon aria-hidden='true' className='shrink-0 text-[13px]' />
        <span className='truncate'>
          {formatTemperature(forecast.minTemperature)}/
          {formatTemperature(forecast.maxTemperature)}
        </span>
        <span className='inline-flex items-center gap-1 text-[11px]'>
          <FaTint aria-hidden='true' />
          {forecast.precipitationProbability}%
        </span>
      </div>
    );
  }

  return (
    <div
      className={[
        'mb-4 rounded-2xl border border-slate-100 p-4',
        weatherMeta.className,
      ].join(' ')}
    >
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-xl shadow-sm'>
            <Icon aria-hidden='true' />
          </span>
          <div>
            <p className='text-sm font-bold'>{weatherMeta.label}</p>
            <p className='text-xs font-semibold opacity-75'>
              Prognoza za planiranje dana
            </p>
          </div>
        </div>
        <div className='text-right'>
          <p className='text-2xl font-bold text-indigo-950'>
            {formatTemperature(forecast.minTemperature)} /{' '}
            {formatTemperature(forecast.maxTemperature)}
          </p>
          <p className='text-xs font-semibold opacity-75'>min / max</p>
        </div>
      </div>

      <div className='mt-4 grid gap-2 sm:grid-cols-2'>
        <div className='flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-sm font-semibold'>
          <FaTint aria-hidden='true' />
          Kiša {forecast.precipitationProbability}%
        </div>
        <div className='flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-sm font-semibold'>
          <FaWind aria-hidden='true' />
          Vetar {formatWind(forecast.windSpeed)}
        </div>
      </div>
    </div>
  );
};

export default WeatherForecastBadge;
