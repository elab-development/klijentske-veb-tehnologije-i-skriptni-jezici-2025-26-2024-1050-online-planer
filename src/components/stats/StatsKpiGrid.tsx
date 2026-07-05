import type { IconType } from 'react-icons';
import { FaCheckCircle, FaChartLine, FaTasks } from 'react-icons/fa';

import type { StatsData } from '../../utils/stats';

interface KpiCard {
  id: string;
  label: string;
  value: string;
  sub: string;
  icon: IconType;
  iconClassName: string;
  progress: number;
  progressClassName: string;
}

interface StatsKpiGridProps {
  stats: StatsData;
}

const formatDelta = (delta: number) => {
  if (delta === 0) {
    return 'bez promene';
  }

  return `${delta > 0 ? '+' : ''}${delta}% vs prethodni period`;
};

const StatsKpiGrid = ({ stats }: StatsKpiGridProps) => {
  const kpis: KpiCard[] = [
    {
      id: 'total',
      label: 'Ukupno događaja',
      value: String(stats.total),
      sub: stats.periodTitle,
      icon: FaTasks,
      iconClassName: 'bg-violet-100 text-indigo-500',
      progress: Math.min(stats.total * 5, 100),
      progressClassName: 'bg-indigo-500',
    },
    {
      id: 'completed',
      label: 'Završeno',
      value: String(stats.completed),
      sub: `od ${stats.total} događaja`,
      icon: FaCheckCircle,
      iconClassName: 'bg-emerald-100 text-emerald-500',
      progress: stats.completionPercent,
      progressClassName: 'bg-emerald-500',
    },
    {
      id: 'productivity',
      label: 'Produktivnost',
      value: `${stats.completionPercent}%`,
      sub: formatDelta(stats.productivityDelta),
      icon: FaChartLine,
      iconClassName: 'bg-amber-100 text-amber-500',
      progress: stats.completionPercent,
      progressClassName: 'bg-amber-500',
    },
  ];

  return (
    <section className='grid gap-4 md:grid-cols-3'>
      {kpis.map((kpi) => (
        <article
          key={kpi.id}
          className='rounded-2xl border border-indigo-50 bg-white p-5 shadow-[0_4px_24px_rgba(99,102,241,0.08)]'
        >
          <div
            className={[
              'flex h-11 w-11 items-center justify-center rounded-2xl text-lg',
              kpi.iconClassName,
            ].join(' ')}
          >
            <kpi.icon aria-hidden='true' />
          </div>
          <div className='font-display mt-4 truncate text-3xl text-indigo-950'>
            {kpi.value}
          </div>
          <div className='mt-1 text-sm text-slate-500'>{kpi.label}</div>
          <div className='mt-3 truncate text-xs font-semibold text-slate-400'>
            {kpi.sub}
          </div>
          <div className='mt-4 h-2 overflow-hidden rounded-full bg-slate-100'>
            <div
              className={['h-full rounded-full', kpi.progressClassName].join(
                ' ',
              )}
              style={{ width: `${kpi.progress}%` }}
            />
          </div>
        </article>
      ))}
    </section>
  );
};

export default StatsKpiGrid;
