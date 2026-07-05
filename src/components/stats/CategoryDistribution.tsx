import type { CategoryStat } from '../../utils/stats';

interface CategoryDistributionProps {
  categories: CategoryStat[];
}

const CategoryDistribution = ({ categories }: CategoryDistributionProps) => {
  const total = categories.reduce((sum, category) => sum + category.total, 0);

  return (
    <section className='rounded-2xl border border-indigo-50 bg-white p-5 shadow-[0_4px_24px_rgba(99,102,241,0.08)]'>
      <h2 className='text-base font-bold text-indigo-950'>
        Događaji po kategorijama
      </h2>
      <p className='mt-1 text-sm text-slate-500'>
        Raspodela u aktivnom periodu
      </p>

      <div className='mt-6 space-y-4'>
        {categories.map((category) => {
          const share = total ? Math.round((category.total / total) * 100) : 0;

          return (
            <div key={category.id}>
              <div className='mb-2 flex items-center justify-between gap-3'>
                <div className='flex items-center gap-2 text-sm font-semibold text-slate-600'>
                  <span
                    className='h-3 w-3 rounded-full'
                    style={{ backgroundColor: category.color }}
                  />
                  {category.label}
                </div>
                <div className='text-xs font-bold text-slate-400'>
                  {category.total} · {share}%
                </div>
              </div>
              <div className='h-3 overflow-hidden rounded-full bg-slate-100'>
                <div
                  className='h-full rounded-full'
                  style={{
                    backgroundColor: category.color,
                    width: `${share}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryDistribution;

