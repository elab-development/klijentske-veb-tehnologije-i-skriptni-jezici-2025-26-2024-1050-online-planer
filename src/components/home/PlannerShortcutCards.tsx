import type { IconType } from 'react-icons';
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCalendarDay,
  FaCalendarWeek,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface PlannerShortcut {
  id: string;
  icon: IconType;
  iconClassName: string;
  title: string;
  description: string;
}

const shortcuts: PlannerShortcut[] = [
  {
    id: 'daily',
    icon: FaCalendarDay,
    iconClassName: 'bg-violet-100 text-indigo-500',
    title: 'Dnevni planer',
    description: 'Organizujte događaje po satima i zadržite fokus na danas.',
  },
  {
    id: 'weekly',
    icon: FaCalendarWeek,
    iconClassName: 'bg-emerald-100 text-emerald-500',
    title: 'Nedeljni planer',
    description: 'Pregledajte celu nedelju i ravnomerno rasporedite obaveze.',
  },
  {
    id: 'monthly',
    icon: FaCalendarAlt,
    iconClassName: 'bg-amber-100 text-amber-500',
    title: 'Mesečni planer',
    description: 'Sagledajte mesec unapred zajedno sa praznicima.',
  },
];

const PlannerShortcutCards = () => (
  <section>
    <h2 className='mb-4 text-base font-bold text-indigo-950'>Vaši planeri</h2>
    <div className='grid gap-4 lg:grid-cols-3'>
      {shortcuts.map(({ description, icon: Icon, iconClassName, id, title }) => (
        <Link
          key={id}
          to='/planners'
          className='flex min-h-44 flex-col items-start rounded-2xl border-2 border-transparent bg-white p-5 shadow-[0_4px_24px_rgba(99,102,241,0.08)] transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-[0_8px_32px_rgba(99,102,241,0.14)]'
        >
          <span
            className={[
              'flex h-12 w-12 items-center justify-center rounded-2xl text-xl',
              iconClassName,
            ].join(' ')}
          >
            <Icon aria-hidden='true' />
          </span>
          <span className='mt-4 text-base font-bold text-indigo-950'>
            {title}
          </span>
          <span className='mt-1 text-sm leading-5 text-slate-500'>
            {description}
          </span>
          <span className='mt-auto inline-flex items-center gap-2 pt-4 text-sm font-bold text-indigo-500'>
            Otvori
            <FaArrowRight aria-hidden='true' />
          </span>
        </Link>
      ))}
    </div>
  </section>
);

export default PlannerShortcutCards;

