import { FaPlus } from 'react-icons/fa';

import type { PlannerEvent } from '../../models/PlannerEvent';
import EmptyState from '../planners/EmptyState';
import EventCard from '../planners/EventCard';

interface TodayEventsPanelProps {
  events: PlannerEvent[];
  onAddEvent: () => void;
  onToggleEvent: (event: PlannerEvent) => void;
}

const TodayEventsPanel = ({
  events,
  onAddEvent,
  onToggleEvent,
}: TodayEventsPanelProps) => (
  <section className='rounded-2xl border border-indigo-50 bg-white shadow-[0_4px_24px_rgba(99,102,241,0.08)]'>
    <header className='flex items-center justify-between gap-3 px-5 pt-5'>
      <h2 className='text-base font-bold text-indigo-950'>Događaji danas</h2>
      <button
        type='button'
        onClick={onAddEvent}
        className='inline-flex min-h-9 items-center justify-center gap-2 rounded-xl bg-indigo-100 px-3 text-sm font-semibold text-indigo-500 transition hover:bg-indigo-200'
      >
        <FaPlus aria-hidden='true' className='text-xs' />
        Dodaj
      </button>
    </header>

    <div className='space-y-3 p-5'>
      {events.length ? (
        events.map((event) => (
          <EventCard key={event.id} event={event} onToggle={onToggleEvent} />
        ))
      ) : (
        <EmptyState message='Nema događaja za danas.' />
      )}
    </div>
  </section>
);

export default TodayEventsPanel;

