import { eventCategories } from '../../data/eventCategories';
import type { EventCategoryFilter } from '../../utils/plannerTypes';

interface CategoryFilterBarProps {
  activeCategory: EventCategoryFilter;
  counts: Record<EventCategoryFilter, number>;
  onChange: (category: EventCategoryFilter) => void;
}

const CategoryFilterBar = ({
  activeCategory,
  counts,
  onChange,
}: CategoryFilterBarProps) => (
  <section className='flex flex-wrap gap-3'>
    <button
      type='button'
      onClick={() => onChange('all')}
      aria-pressed={activeCategory === 'all'}
      className={[
        'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition',
        activeCategory === 'all'
          ? 'border-indigo-500 bg-indigo-100 text-indigo-500'
          : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-500',
      ].join(' ')}
    >
      Sve
      <span className='rounded-full bg-white/80 px-2 py-0.5 text-xs'>
        {counts.all}
      </span>
    </button>

    {eventCategories.map((category) => {
      const isActive = activeCategory === category.id;

      return (
        <button
          key={category.id}
          type='button'
          onClick={() => onChange(category.id)}
          aria-pressed={isActive}
          className={[
            'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition',
            isActive
              ? 'bg-white'
              : 'border-slate-200 bg-white text-slate-500 hover:bg-indigo-50',
          ].join(' ')}
          style={{
            borderColor: isActive ? category.color : undefined,
            color: isActive ? category.color : undefined,
          }}
        >
          <span
            className='h-2.5 w-2.5 rounded-full'
            style={{ backgroundColor: category.color }}
          />
          {category.label}
          <span
            className='rounded-full px-2 py-0.5 text-xs'
            style={{
              backgroundColor: category.lightColor,
              color: category.color,
            }}
          >
            {counts[category.id]}
          </span>
        </button>
      );
    })}
  </section>
);

export default CategoryFilterBar;
