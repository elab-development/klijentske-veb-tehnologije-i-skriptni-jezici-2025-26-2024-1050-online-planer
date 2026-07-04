import type { IconType } from 'react-icons';
import { FaCalendarAlt, FaCalendarDay, FaCalendarWeek } from 'react-icons/fa';

import type { PlannerView } from '../../utils/plannerTypes';

interface PlannerViewOption {
  id: PlannerView;
  title: string;
  description: string;
  icon: IconType;
}

interface PlannerViewTabsProps {
  activeView: PlannerView;
  counts: Record<PlannerView, number>;
  onChange: (view: PlannerView) => void;
}

const plannerViews: PlannerViewOption[] = [
  {
    id: 'daily',
    title: 'Dnevni planer',
    description: 'Fokus na jedan dan i sve obaveze po satima.',
    icon: FaCalendarDay,
  },
  {
    id: 'weekly',
    title: 'Nedeljni planer',
    description: 'Sedam kolona za pregled cele nedelje.',
    icon: FaCalendarWeek,
  },
  {
    id: 'monthly',
    title: 'Mesečni planer',
    description: 'Kalendar meseca sa događajima po danima.',
    icon: FaCalendarAlt,
  },
];

const PlannerViewTabs = ({
  activeView,
  counts,
  onChange,
}: PlannerViewTabsProps) => (
  <section className='grid gap-4 lg:grid-cols-3'>
    {plannerViews.map(({ description, icon: Icon, id, title }) => (
      <button
        key={id}
        type='button'
        onClick={() => onChange(id)}
        className={[
          'flex min-h-36 flex-col items-start rounded-2xl border-2 bg-white p-5 text-left shadow-[0_4px_24px_rgba(99,102,241,0.08)] transition hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(99,102,241,0.14)]',
          activeView === id
            ? 'border-indigo-500'
            : 'border-transparent hover:border-indigo-300',
        ].join(' ')}
      >
        <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-xl text-indigo-500'>
          <Icon aria-hidden='true' />
        </span>
        <span className='mt-4 text-base font-bold text-indigo-950'>
          {title}
        </span>
        <span className='mt-1 text-sm leading-5 text-slate-500'>
          {description}
        </span>
        <span className='mt-auto pt-4 text-sm font-bold text-indigo-500'>
          {counts[id]} događaja
        </span>
      </button>
    ))}
  </section>
);

export default PlannerViewTabs;

