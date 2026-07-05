import { FaFlag } from 'react-icons/fa';

import type { PublicHoliday } from '../../types/PublicHoliday';
import { shortDateFormatter } from '../../utils/plannerDate';

interface UpcomingHolidaysCardProps {
  holidays: PublicHoliday[];
}

const UpcomingHolidaysCard = ({ holidays }: UpcomingHolidaysCardProps) => (
  <section className='rounded-2xl border border-amber-100 bg-linear-to-br from-indigo-50 to-amber-50 p-5 shadow-[0_4px_24px_rgba(99,102,241,0.08)]'>
    <header className='mb-4 flex items-center gap-2 text-sm font-bold text-indigo-950'>
      <FaFlag aria-hidden='true' className='text-indigo-500' />
      Javni praznici
    </header>

    {holidays.length ? (
      <div className='space-y-2'>
        {holidays.slice(0, 4).map((holiday) => (
          <div
            key={`${holiday.date}-${holiday.localName}`}
            className='flex items-center gap-3 rounded-xl border border-amber-100 bg-white px-3 py-2'
          >
            <span className='shrink-0 rounded-lg bg-indigo-100 px-2 py-1 text-xs font-bold text-indigo-500'>
              {shortDateFormatter.format(new Date(holiday.date))}
            </span>
            <span className='min-w-0 truncate text-sm font-semibold text-slate-600'>
              {holiday.localName}
            </span>
          </div>
        ))}
      </div>
    ) : (
      <p className='text-sm text-slate-500'>Praznici se učitavaju.</p>
    )}

    <div className='mt-4 text-xs font-semibold text-emerald-600'>
      Podaci učitani preko eksternog servisa
    </div>
  </section>
);

export default UpcomingHolidaysCard;

