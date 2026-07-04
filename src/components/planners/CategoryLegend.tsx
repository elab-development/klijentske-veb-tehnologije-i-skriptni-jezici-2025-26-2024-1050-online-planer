import { eventCategories } from '../../data/eventCategories';

const CategoryLegend = () => (
  <section className='flex flex-wrap gap-3'>
    {eventCategories.map((category) => (
      <span
        key={category.id}
        className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-500'
      >
        <span
          className='h-2.5 w-2.5 rounded-full'
          style={{ backgroundColor: category.color }}
        />
        {category.label}
      </span>
    ))}
  </section>
);

export default CategoryLegend;

