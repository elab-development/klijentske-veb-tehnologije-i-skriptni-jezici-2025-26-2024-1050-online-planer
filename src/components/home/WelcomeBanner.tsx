import { FaPlus } from 'react-icons/fa';

import type { PlannerEvent } from '../../models/PlannerEvent';
import type { User } from '../../types/User';
import { dayFormatter, getEventTime } from '../../utils/plannerDate';

interface WelcomeBannerProps {
  currentUser: User;
  today: Date;
  todayEventsCount: number;
  nextEvent?: PlannerEvent;
  onAddEvent: () => void;
}

const WelcomeBanner = ({
  currentUser,
  nextEvent,
  onAddEvent,
  today,
  todayEventsCount,
}: WelcomeBannerProps) => (
  <section className='relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-500 to-violet-500 px-6 py-7 text-white shadow-lg shadow-indigo-200 sm:px-8'>
    <div className='absolute -right-16 -top-20 h-72 w-72 rounded-full bg-white/10' />
    <div className='absolute bottom-[-80px] right-28 h-48 w-48 rounded-full bg-white/10' />

    <div className='relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
      <div>
        <h1 className='font-display text-4xl text-white'>
          Dobrodošli, {currentUser.name.split(' ')[0]}!
        </h1>
        <p className='mt-2 max-w-2xl text-sm leading-6 text-white/85'>
          {dayFormatter.format(today)} · Imate{' '}
          <strong>{todayEventsCount} događaja</strong> danas
          {nextEvent
            ? ` · Sledeći: ${nextEvent.title} u ${getEventTime(nextEvent)}`
            : ' · Danas nema novih obaveza'}
        </p>
      </div>

      <button
        type='button'
        onClick={onAddEvent}
        className='inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/20 px-5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/30'
      >
        <FaPlus aria-hidden='true' />
        Novi događaj
      </button>
    </div>
  </section>
);

export default WelcomeBanner;

