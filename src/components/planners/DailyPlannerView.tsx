import type { PlannerEvent } from '../../models/PlannerEvent';
import { dayFormatter } from '../../utils/plannerDate';
import { getPlannerEmptyMessage } from '../../utils/plannerEvents';
import EmptyState from './EmptyState';
import EventCard from './EventCard';

interface DailyPlannerViewProps {
  events: PlannerEvent[];
  referenceDate: Date;
  onToggleEvent: (event: PlannerEvent) => void;
}

const DailyPlannerView = ({
  events,
  referenceDate,
  onToggleEvent,
}: DailyPlannerViewProps) => (
  <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_24px_rgba(99,102,241,0.08)]'>
    <div className='mb-5 flex flex-wrap items-center justify-between gap-3'>
      <div>
        <h2 className='font-display text-3xl text-indigo-950'>
          Dnevni planer
        </h2>
        <p className='mt-1 text-sm text-slate-500'>
          {dayFormatter.format(referenceDate)}
        </p>
      </div>
      <span className='rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-500'>
        {events.length} događaja
      </span>
    </div>

    {events.length ? (
      <div className='space-y-3'>
        {events.map((event) => (
          <EventCard key={event.id} event={event} onToggle={onToggleEvent} />
        ))}
      </div>
    ) : (
      <EmptyState message={getPlannerEmptyMessage('daily')} />
    )}
  </section>
);

export default DailyPlannerView;

