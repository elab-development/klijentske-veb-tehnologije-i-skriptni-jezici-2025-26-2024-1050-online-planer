import { FaFlag } from 'react-icons/fa';

import type { PublicHoliday } from '../../types/PublicHoliday';

interface HolidayListProps {
  holidays: PublicHoliday[];
  compact?: boolean;
}

const HolidayList = ({ compact = false, holidays }: HolidayListProps) => {
  if (!holidays.length) {
    return null;
  }

  if (compact) {
    return (
      <div className='space-y-1'>
        {holidays.map((holiday) => (
          <div
            key={`${holiday.date}-${holiday.localName}`}
            className='flex min-w-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700'
            title={holiday.localName}
          >
            <FaFlag aria-hidden='true' className='shrink-0 text-[10px]' />
            <span className='truncate'>{holiday.localName}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='mb-4 rounded-2xl border border-amber-100 bg-amber-50 p-4'>
      <div className='mb-2 flex items-center gap-2 text-sm font-bold text-amber-700'>
        <FaFlag aria-hidden='true' />
        Praznici
      </div>
      <div className='space-y-2'>
        {holidays.map((holiday) => (
          <div
            key={`${holiday.date}-${holiday.localName}`}
            className='rounded-xl bg-white px-3 py-2 text-sm text-slate-600 shadow-sm'
          >
            <div className='font-semibold text-indigo-950'>
              {holiday.localName}
            </div>
            {holiday.name !== holiday.localName ? (
              <div className='text-xs text-slate-400'>{holiday.name}</div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HolidayList;

