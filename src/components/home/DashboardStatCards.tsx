import type { IconType } from 'react-icons';
import { FaCheckCircle, FaClock, FaFlag, FaTasks } from 'react-icons/fa';

interface StatCard {
  id: string;
  icon: IconType;
  iconClassName: string;
  label: string;
  value: string;
  detail: string;
}

interface DashboardStatCardsProps {
  completedToday: number;
  nextEventLabel: string;
  nextEventTime: string;
  nextHolidayDate: string;
  nextHolidayLabel: string;
  todayEventsCount: number;
  yesterdayDelta: number;
}

const getDeltaLabel = (delta: number) => {
  if (delta === 0) {
    return 'Isto kao juče';
  }

  return `${delta > 0 ? '+' : ''}${delta} vs juče`;
};

const DashboardStatCards = ({
  completedToday,
  nextEventLabel,
  nextEventTime,
  nextHolidayDate,
  nextHolidayLabel,
  todayEventsCount,
  yesterdayDelta,
}: DashboardStatCardsProps) => {
  const completionPercent = todayEventsCount
    ? Math.round((completedToday / todayEventsCount) * 100)
    : 0;

  const stats: StatCard[] = [
    {
      id: 'today',
      icon: FaTasks,
      iconClassName: 'bg-violet-100 text-indigo-500',
      label: 'Događaja danas',
      value: String(todayEventsCount),
      detail: getDeltaLabel(yesterdayDelta),
    },
    {
      id: 'completed',
      icon: FaCheckCircle,
      iconClassName: 'bg-emerald-100 text-emerald-500',
      label: 'Završeni događaji',
      value: String(completedToday),
      detail: `${completionPercent}% urađeno`,
    },
    {
      id: 'next-event',
      icon: FaClock,
      iconClassName: 'bg-amber-100 text-amber-500',
      label: 'Sledeći događaj',
      value: nextEventTime,
      detail: nextEventLabel,
    },
    {
      id: 'holiday',
      icon: FaFlag,
      iconClassName: 'bg-rose-100 text-rose-500',
      label: 'Najbliži praznik',
      value: nextHolidayDate,
      detail: nextHolidayLabel,
    },
  ];

  return (
    <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {stats.map(({ detail, icon: Icon, iconClassName, id, label, value }) => (
        <article
          key={id}
          className='rounded-2xl border border-indigo-50 bg-white p-5 shadow-[0_4px_24px_rgba(99,102,241,0.08)] transition hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(99,102,241,0.14)]'
        >
          <div
            className={[
              'flex h-11 w-11 items-center justify-center rounded-2xl text-lg',
              iconClassName,
            ].join(' ')}
          >
            <Icon aria-hidden='true' />
          </div>
          <div className='font-display mt-4 truncate text-3xl text-indigo-950'>
            {value}
          </div>
          <div className='mt-1 text-sm text-slate-500'>{label}</div>
          <div className='mt-3 truncate text-xs font-semibold text-slate-400'>
            {detail}
          </div>
        </article>
      ))}
    </section>
  );
};

export default DashboardStatCards;

