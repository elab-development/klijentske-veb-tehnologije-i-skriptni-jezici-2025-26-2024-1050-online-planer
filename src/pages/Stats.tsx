import { useMemo, useState } from 'react';

import CategoryDistribution from '../components/stats/CategoryDistribution';
import CompletionBarChart from '../components/stats/CompletionBarChart';
import ProductivityTrend from '../components/stats/ProductivityTrend';
import StatsKpiGrid from '../components/stats/StatsKpiGrid';
import StatsPeriodTabs from '../components/stats/StatsPeriodTabs';
import { useAuth } from '../contexts/useAuth';
import type { PlannerEvent } from '../models/PlannerEvent';
import { plannerEventStorage } from '../services/PlannerEventStorage';
import { startOfDay } from '../utils/plannerDate';
import { getStatsData, type StatsPeriod } from '../utils/stats';

const Stats = () => {
  const { currentUser } = useAuth();
  const [activePeriod, setActivePeriod] = useState<StatsPeriod>('weekly');
  const [referenceDate] = useState(() => startOfDay(new Date()));
  const [events] = useState<PlannerEvent[]>(() =>
    currentUser ? plannerEventStorage.seedUserEvents(currentUser.id) : [],
  );

  const stats = useMemo(
    () => getStatsData(events, activePeriod, referenceDate),
    [activePeriod, events, referenceDate],
  );

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.1em] text-slate-400'>
            Statistika produktivnosti
          </p>
          <h1 className='font-display mt-1 text-4xl text-indigo-950'>
            Pregled učinka
          </h1>
          <p className='mt-2 text-sm text-slate-500'>
            Analiza događaja za period: {stats.periodTitle}
          </p>
        </div>

        <StatsPeriodTabs
          activePeriod={activePeriod}
          onChange={setActivePeriod}
        />
      </div>

      <StatsKpiGrid stats={stats} />

      <section className='grid gap-5 xl:grid-cols-[1.4fr_0.9fr]'>
        <CompletionBarChart buckets={stats.buckets} />
        <CategoryDistribution categories={stats.categoryStats} />
      </section>

      <ProductivityTrend points={stats.trend} />
    </div>
  );
};

export default Stats;
