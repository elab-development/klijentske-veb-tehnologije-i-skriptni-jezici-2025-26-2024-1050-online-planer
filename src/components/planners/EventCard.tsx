import { FaCheck, FaClock, FaStickyNote } from 'react-icons/fa';

import { getEventCategory } from '../../data/eventCategories';
import type { PlannerEvent } from '../../models/PlannerEvent';
import { getEventTime } from '../../utils/plannerDate';

interface EventCardProps {
  event: PlannerEvent;
  onToggle: (event: PlannerEvent) => void;
  compact?: boolean;
}

const EventCard = ({ compact = false, event, onToggle }: EventCardProps) => {
  const category = getEventCategory(event.categoryId);

  return (
    <article
      className={[
        'group flex gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md',
        compact ? 'items-start' : 'items-center',
      ].join(' ')}
      style={{ borderLeft: `4px solid ${category.color}` }}
    >
      <button
        type='button'
        onClick={() => onToggle(event)}
        className={[
          'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition',
          event.isCompleted
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-300 text-transparent hover:border-emerald-500',
        ].join(' ')}
        aria-label={
          event.isCompleted
            ? 'Označi događaj kao nezavršen'
            : 'Označi događaj kao završen'
        }
      >
        <FaCheck aria-hidden='true' className='text-[10px]' />
      </button>

      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-center gap-2'>
          <span
            className='rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide'
            style={{
              backgroundColor: category.lightColor,
              color: category.color,
            }}
          >
            {category.label}
          </span>
          <span className='inline-flex items-center gap-1 text-xs font-semibold text-slate-400'>
            <FaClock aria-hidden='true' />
            {getEventTime(event)}
          </span>
        </div>

        <h3
          className={[
            'mt-1 truncate text-sm font-semibold text-indigo-950',
            event.isCompleted ? 'text-slate-400 line-through' : '',
          ].join(' ')}
        >
          {event.title}
        </h3>

        {!compact && event.note ? (
          <p className='mt-2 flex items-start gap-2 text-sm leading-5 text-slate-500'>
            <FaStickyNote
              aria-hidden='true'
              className='mt-1 shrink-0 text-xs text-slate-300'
            />
            <span>{event.note}</span>
          </p>
        ) : null}
      </div>
    </article>
  );
};

export default EventCard;

