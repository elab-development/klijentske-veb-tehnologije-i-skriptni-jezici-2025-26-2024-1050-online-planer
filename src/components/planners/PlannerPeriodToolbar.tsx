import { FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';

import { getPlannerTitle } from '../../utils/plannerDate';
import type { PlannerView } from '../../utils/plannerTypes';

interface PlannerPeriodToolbarProps {
  activeView: PlannerView;
  completedEventsCount: number;
  referenceDate: Date;
  totalEventsCount: number;
  onAddEvent: () => void;
  onMovePeriod: (direction: -1 | 1) => void;
  onToday: () => void;
}

const viewLabels: Record<PlannerView, string> = {
  daily: 'Dnevni prikaz',
  weekly: 'Nedeljni prikaz',
  monthly: 'Mesečni prikaz',
};

const PlannerPeriodToolbar = ({
  activeView,
  completedEventsCount,
  referenceDate,
  totalEventsCount,
  onAddEvent,
  onMovePeriod,
  onToday,
}: PlannerPeriodToolbarProps) => (
  <section className='flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_24px_rgba(99,102,241,0.08)] xl:flex-row xl:items-center xl:justify-between'>
    <div>
      <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-400'>
        {viewLabels[activeView]}
      </p>
      <h2 className='font-display mt-1 text-3xl capitalize text-indigo-950'>
        {getPlannerTitle(activeView, referenceDate)}
      </h2>
    </div>

    <div className='flex flex-wrap items-center gap-3'>
      <div className='flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1'>
        <button
          type='button'
          onClick={() => onMovePeriod(-1)}
          className='flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-indigo-500'
          aria-label='Prethodni period'
        >
          <FaChevronLeft aria-hidden='true' />
        </button>
        <button
          type='button'
          onClick={onToday}
          className='min-h-10 rounded-lg px-4 text-sm font-bold text-indigo-500 transition hover:bg-white'
        >
          Danas
        </button>
        <button
          type='button'
          onClick={() => onMovePeriod(1)}
          className='flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-indigo-500'
          aria-label='Sledeći period'
        >
          <FaChevronRight aria-hidden='true' />
        </button>
      </div>

      <div className='rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-500'>
        {completedEventsCount}/{totalEventsCount} završeno
      </div>

      <button
        type='button'
        onClick={onAddEvent}
        className='inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300'
      >
        <FaPlus aria-hidden='true' />
        Novi događaj
      </button>
    </div>
  </section>
);

export default PlannerPeriodToolbar;
