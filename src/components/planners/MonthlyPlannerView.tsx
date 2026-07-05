import type { PlannerEvent } from '../../models/PlannerEvent';
import type { WeatherForecastsByDate } from '../../types/WeatherForecast';
import type { HolidaysByDate } from '../../utils/holidayUtils';
import {
  getMonthGridDays,
  monthWeekdays,
  toDateKey,
} from '../../utils/plannerDate';
import type { EventsByDate } from '../../utils/plannerTypes';
import EventCard from './EventCard';
import HolidayList from './HolidayList';
import WeatherForecastBadge from './WeatherForecastBadge';

interface MonthlyPlannerViewProps {
  eventsByDate: EventsByDate;
  holidaysByDate: HolidaysByDate;
  referenceDate: Date;
  weatherForecastsByDate: WeatherForecastsByDate;
  onToggleEvent: (event: PlannerEvent) => void;
}

const MonthlyPlannerView = ({
  eventsByDate,
  holidaysByDate,
  referenceDate,
  weatherForecastsByDate,
  onToggleEvent,
}: MonthlyPlannerViewProps) => {
  const monthDays = getMonthGridDays(referenceDate);
  const todayKey = toDateKey(new Date());

  return (
    <section className='overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-[0_4px_24px_rgba(99,102,241,0.08)]'>
      <div className='min-w-[980px]'>
        <div className='grid grid-cols-7 border-b border-slate-200 bg-indigo-50'>
          {monthWeekdays.map((weekday) => (
            <div
              key={weekday}
              className='px-2 py-3 text-center text-xs font-bold uppercase tracking-[0.08em] text-indigo-500'
            >
              {weekday}
            </div>
          ))}
        </div>

        <div className='grid grid-cols-7'>
          {monthDays.map((date) => {
            const dateKey = toDateKey(date);
            const dayEvents = eventsByDate[dateKey] ?? [];
            const dayHolidays = holidaysByDate[dateKey] ?? [];
            const dayWeatherForecast = weatherForecastsByDate[dateKey];
            const isCurrentMonth =
              date.getMonth() === referenceDate.getMonth();
            const isToday = dateKey === todayKey;

            return (
              <article
                key={dateKey}
                className={[
                  'min-h-[170px] border-b border-r border-slate-200 p-3',
                  isCurrentMonth ? 'bg-white' : 'bg-slate-50 text-slate-400',
                  isToday ? 'ring-2 ring-inset ring-indigo-400' : '',
                ].join(' ')}
              >
                <header className='mb-2 flex items-center justify-between'>
                  <span
                    className={[
                      'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                      isToday
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-100 text-slate-500',
                    ].join(' ')}
                  >
                    {date.getDate()}
                  </span>
                  {dayEvents.length ? (
                    <span className='text-xs font-bold text-indigo-500'>
                      {dayEvents.length}
                    </span>
                  ) : null}
                </header>

                <HolidayList compact holidays={dayHolidays} />
                <WeatherForecastBadge compact forecast={dayWeatherForecast} />

                <div className='space-y-2'>
                  {dayEvents.slice(0, 3).map((event) => (
                    <EventCard
                      compact
                      key={event.id}
                      event={event}
                      onToggle={onToggleEvent}
                    />
                  ))}

                  {dayEvents.length > 3 ? (
                    <p className='text-xs font-semibold text-slate-400'>
                      +{dayEvents.length - 3} još
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MonthlyPlannerView;
