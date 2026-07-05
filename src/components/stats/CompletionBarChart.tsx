import type { StatsBucket } from '../../utils/stats';

interface CompletionBarChartProps {
  buckets: StatsBucket[];
}

const CompletionBarChart = ({ buckets }: CompletionBarChartProps) => {
  const maxValue = Math.max(...buckets.map((bucket) => bucket.total), 1);
  const minChartWidth = buckets.length > 14 ? buckets.length * 56 : 0;

  return (
    <section className='rounded-2xl border border-indigo-50 bg-white p-5 shadow-[0_4px_24px_rgba(99,102,241,0.08)]'>
      <h2 className='text-base font-bold text-indigo-950'>
        Završeni događaji po periodima
      </h2>
      <p className='mt-1 text-sm text-slate-500'>
        Poređenje ukupnih i završenih događaja
      </p>

      <div className='mt-6 overflow-x-auto pb-2'>
        <div
          className='flex h-72 items-end gap-3'
          style={{ minWidth: minChartWidth || undefined }}
        >
          {buckets.map((bucket) => (
            <div
              key={bucket.label}
              className='flex min-w-12 flex-1 flex-col items-center gap-2'
            >
              <div className='flex h-52 w-full items-end gap-1'>
                <div
                  className='w-full rounded-t-xl bg-indigo-100'
                  style={{
                    height: `${Math.max((bucket.total / maxValue) * 100, 4)}%`,
                  }}
                  title={`Ukupno: ${bucket.total}`}
                />
                <div
                  className='w-full rounded-t-xl bg-indigo-500'
                  style={{
                    height: `${Math.max(
                      (bucket.completed / maxValue) * 100,
                      bucket.completed ? 4 : 0,
                    )}%`,
                  }}
                  title={`Završeno: ${bucket.completed}`}
                />
              </div>
              <div className='text-center text-xs font-bold text-slate-400'>
                {bucket.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompletionBarChart;
