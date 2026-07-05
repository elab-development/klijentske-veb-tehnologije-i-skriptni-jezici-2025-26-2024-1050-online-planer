import type { PlannerEvent } from '../../models/PlannerEvent';
import type { WeatherForecastsByDate } from '../../types/WeatherForecast';
import type { HolidaysByDate } from '../../utils/holidayUtils';
import {
  getWeekDays,
  toDateKey,
  weekdayFormatter,
} from '../../utils/plannerDate';
import type { EventsByDate } from '../../utils/plannerTypes';
import EventCard from './EventCard';
import HolidayList from './HolidayList';
import WeatherForecastBadge from './WeatherForecastBadge';

interface WeeklyPlannerViewProps {
  eventsByDate: EventsByDate;
  holidaysByDate: HolidaysByDate;
  referenceDate: Date;
  weatherForecastsByDate: WeatherForecastsByDate;
  onToggleEvent: (event: PlannerEvent) => void;
}

const WeeklyPlannerView = ({
  eventsByDate,
  holidaysByDate,
  referenceDate,
  weatherForecastsByDate,
  onToggleEvent,
}: WeeklyPlannerViewProps) => {
  const weekDays = getWeekDays(referenceDate);
  const todayKey = toDateKey(new Date());

  return (
    <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-7'>
      {weekDays.map((date) => {
        const dateKey = toDateKey(date);
        const dayEvents = eventsByDate[dateKey] ?? [];
        const dayHolidays = holidaysByDate[dateKey] ?? [];
        const dayWeatherForecast = weatherForecastsByDate[dateKey];
        const isToday = dateKey === todayKey;

        return (
          <article
            key={dateKey}
            className={[
              'min-h-[280px] rounded-2xl border bg-white p-4 shadow-[0_4px_24px_rgba(99,102,241,0.08)]',
              isToday
                ? 'border-indigo-500 ring-4 ring-indigo-100'
                : 'border-slate-200',
            ].join(' ')}
          >
            <header className='mb-4 flex items-center justify-between'>
              <div>
                <p className='text-xs font-bold uppercase tracking-[0.08em] text-slate-400'>
                  {weekdayFormatter.format(date)}
                </p>
                <h3 className='font-display text-3xl text-indigo-950'>
                  {date.getDate()}
                </h3>
              </div>
              <span className='rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500'>
                {dayEvents.length}
              </span>
            </header>

            <HolidayList compact holidays={dayHolidays} />
            <WeatherForecastBadge compact forecast={dayWeatherForecast} />

            {dayEvents.length ? (
              <div className='mt-3 space-y-3'>
                {dayEvents.map((event) => (
                  <EventCard
                    compact
                    key={event.id}
                    event={event}
                    onToggle={onToggleEvent}
                  />
                ))}
              </div>
            ) : (
              <p className='mt-3 rounded-xl border border-dashed border-slate-200 px-3 py-4 text-center text-sm text-slate-400'>
                Slobodan dan
              </p>
            )}
          </article>
        );
      })}
    </section>
  );
};

export default WeeklyPlannerView;
