import type { TrendPoint } from '../../utils/stats';

interface ProductivityTrendProps {
  points: TrendPoint[];
}

const ProductivityTrend = ({ points }: ProductivityTrendProps) => (
  <section className='rounded-2xl border border-indigo-50 bg-white p-5 shadow-[0_4px_24px_rgba(99,102,241,0.08)]'>
    <h2 className='text-base font-bold text-indigo-950'>
      Trend produktivnosti
    </h2>
    <p className='mt-1 text-sm text-slate-500'>
      Procenat završenih događaja kroz poslednja četiri perioda
    </p>

    <div className='mt-6 grid gap-3 sm:grid-cols-4'>
      {points.map((point) => (
        <article
          key={point.label}
          className='rounded-2xl border border-slate-100 bg-indigo-50 p-4'
        >
          <div className='text-xs font-bold uppercase tracking-[0.08em] text-slate-400'>
            {point.label}
          </div>
          <div className='font-display mt-2 text-3xl text-indigo-950'>
            {point.percent}%
          </div>
          <div className='mt-3 h-2 overflow-hidden rounded-full bg-white'>
            <div
              className='h-full rounded-full bg-indigo-500'
              style={{ width: `${point.percent}%` }}
            />
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default ProductivityTrend;

