import type { StatsPeriod } from '../../utils/stats';

interface StatsPeriodTabsProps {
  activePeriod: StatsPeriod;
  onChange: (period: StatsPeriod) => void;
}

const periods: { id: StatsPeriod; label: string }[] = [
  { id: 'daily', label: 'Dnevni' },
  { id: 'weekly', label: 'Nedeljni' },
  { id: 'monthly', label: 'Mesečni' },
];

const StatsPeriodTabs = ({ activePeriod, onChange }: StatsPeriodTabsProps) => (
  <section className='flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_4px_24px_rgba(99,102,241,0.08)]'>
    {periods.map((period) => (
      <button
        key={period.id}
        type='button'
        onClick={() => onChange(period.id)}
        className={[
          'min-h-11 rounded-xl px-5 text-sm font-bold transition',
          activePeriod === period.id
            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200'
            : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-500',
        ].join(' ')}
      >
        {period.label}
      </button>
    ))}
  </section>
);

export default StatsPeriodTabs;

