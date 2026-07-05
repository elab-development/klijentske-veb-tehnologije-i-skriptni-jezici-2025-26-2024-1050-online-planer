import { useMemo, useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import type { IconType } from 'react-icons';
import {
  FaArrowRight,
  FaBolt,
  FaCalendarPlus,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaLayerGroup,
} from 'react-icons/fa';

import AddEventModal, {
  type AddEventFormValues,
} from '../components/planners/AddEventModal';
import EmptyState from '../components/planners/EmptyState';
import EventCard from '../components/planners/EventCard';
import { eventCategories, getEventCategory } from '../data/eventCategories';
import { useAuth } from '../contexts/useAuth';
import type { PlannerEvent } from '../models/PlannerEvent';
import { plannerEventStorage } from '../services/PlannerEventStorage';
import {
  addDays,
  getEventTime,
  parseEventDate,
  shortDateFormatter,
  startOfDay,
  toDateKey,
  toDateTimeLocalValue,
  weekdayFormatter,
} from '../utils/plannerDate';
import { getEventsByDate } from '../utils/plannerEvents';

const MAX_FOCUS_EVENTS = 3;

const sortByDate = (a: PlannerEvent, b: PlannerEvent) =>
  parseEventDate(a).getTime() - parseEventDate(b).getTime();

const getOpenEvents = (events: PlannerEvent[]) =>
  events.filter((event) => !event.isCompleted);

const getCategoryBalanceMessage = (events: PlannerEvent[]) => {
  if (!events.length) {
    return 'Nema aktivnih obaveza u narednih 7 dana.';
  }

  const categoryCounts = eventCategories.map((category) => ({
    ...category,
    count: events.filter((event) => event.categoryId === category.id).length,
  }));
  const strongestCategory = categoryCounts.reduce((best, category) =>
    category.count > best.count ? category : best,
  );
  const quietCategory = categoryCounts.find((category) => category.count === 0);

  if (quietCategory) {
    return `${strongestCategory.label} trenutno nosi najviše fokusa, dok je kategorija ${quietCategory.label.toLowerCase()} mirnija ove nedelje.`;
  }

  return `${strongestCategory.label} trenutno nosi najviše fokusa u narednih 7 dana.`;
};

const Focus = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<PlannerEvent[]>(() =>
    currentUser ? plannerEventStorage.seedUserEvents(currentUser.id) : [],
  );
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const today = useMemo(() => startOfDay(new Date()), []);
  const tomorrow = useMemo(() => addDays(today, 1), [today]);
  const nextWeek = useMemo(() => addDays(today, 7), [today]);

  const openEvents = useMemo(() => getOpenEvents(events), [events]);
  const overdueEvents = useMemo(
    () =>
      openEvents
        .filter((event) => parseEventDate(event).getTime() < today.getTime())
        .sort(sortByDate),
    [openEvents, today],
  );
  const todayEvents = useMemo(
    () =>
      openEvents
        .filter((event) => toDateKey(parseEventDate(event)) === toDateKey(today))
        .sort(sortByDate),
    [openEvents, today],
  );
  const upcomingEvents = useMemo(
    () =>
      openEvents
        .filter((event) => {
          const eventTime = parseEventDate(event).getTime();
          return eventTime >= tomorrow.getTime() && eventTime < nextWeek.getTime();
        })
        .sort(sortByDate),
    [nextWeek, openEvents, tomorrow],
  );
  const nextSevenDaysEvents = useMemo(
    () =>
      openEvents
        .filter((event) => {
          const eventTime = parseEventDate(event).getTime();
          return eventTime >= today.getTime() && eventTime < nextWeek.getTime();
        })
        .sort(sortByDate),
    [nextWeek, openEvents, today],
  );
  const focusEvents = useMemo(
    () =>
      [...overdueEvents, ...todayEvents, ...upcomingEvents].slice(
        0,
        MAX_FOCUS_EVENTS,
      ),
    [overdueEvents, todayEvents, upcomingEvents],
  );
  const nextEventsByDate = useMemo(
    () => getEventsByDate(nextSevenDaysEvents),
    [nextSevenDaysEvents],
  );
  const nextSevenDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(today, index)),
    [today],
  );
  const completedCount = events.filter((event) => event.isCompleted).length;
  const completionRate = events.length
    ? Math.round((completedCount / events.length) * 100)
    : 0;
  const categoryBalanceMessage = getCategoryBalanceMessage(nextSevenDaysEvents);

  const refreshEvents = () => {
    if (!currentUser) {
      return;
    }

    setEvents(plannerEventStorage.loadByUser(currentUser.id));
  };

  const handleToggleEvent = (event: PlannerEvent) => {
    if (!currentUser) {
      return;
    }

    plannerEventStorage.setCompleted(event.id, currentUser.id, !event.isCompleted);
    refreshEvents();
  };

  const handleCreateEvent = (values: AddEventFormValues) => {
    if (!currentUser) {
      return;
    }

    if (!values.title.trim() || !values.dateTime.trim()) {
      toast.error('Unesite naziv, datum i vreme događaja.');
      return;
    }

    try {
      plannerEventStorage.create({
        userId: currentUser.id,
        title: values.title,
        dateTime: values.dateTime,
        categoryId: values.categoryId,
        note: values.note,
      });

      refreshEvents();
      setIsAddEventModalOpen(false);
      toast.success('Događaj je dodat u fokus.');
    } catch {
      toast.error('Događaj nije dodat. Proverite unete podatke.');
    }
  };

  return (
    <div className='space-y-6'>
      <section className='overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 via-violet-600 to-amber-300 p-6 text-white shadow-xl shadow-indigo-200 sm:p-8'>
        <div className='grid gap-6 xl:grid-cols-[1fr_340px] xl:items-end'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[0.12em] text-indigo-100'>
              Fokus za danas
            </p>
            <h1 className='font-display mt-2 text-4xl sm:text-5xl'>
              Šta prvo treba uraditi?
            </h1>
            <p className='mt-3 max-w-2xl text-sm leading-6 text-indigo-50 sm:text-base'>
              Prioriteti su izdvojeni iz zakašnjenih, današnjih i najbližih
              nezavršenih događaja.
            </p>
          </div>

          <div className='grid grid-cols-3 gap-3 rounded-2xl bg-white/15 p-3 backdrop-blur'>
            <FocusHeroStat label='Fokus' value={focusEvents.length} />
            <FocusHeroStat label='Kasni' value={overdueEvents.length} />
            <FocusHeroStat label='Učinak' value={`${completionRate}%`} />
          </div>
        </div>
      </section>

      <section className='grid gap-5 xl:grid-cols-3'>
        <FocusMetricCard
          icon={FaBolt}
          label='Prioriteti'
          value={focusEvents.length}
          tone='indigo'
        />
        <FocusMetricCard
          icon={FaExclamationTriangle}
          label='Zakašnjeno'
          value={overdueEvents.length}
          tone='amber'
        />
        <FocusMetricCard
          icon={FaClock}
          label='Narednih 7 dana'
          value={nextSevenDaysEvents.length}
          tone='emerald'
        />
      </section>

      <section className='grid gap-5 xl:grid-cols-[1.1fr_0.9fr]'>
        <FocusPanel
          title='Današnji fokus'
          action={
            <button
              type='button'
              onClick={() => setIsAddEventModalOpen(true)}
              className='inline-flex min-h-9 items-center justify-center gap-2 rounded-xl bg-indigo-100 px-3 text-sm font-semibold text-indigo-500 transition hover:bg-indigo-200'
            >
              <FaCalendarPlus aria-hidden='true' className='text-xs' />
              Dodaj
            </button>
          }
        >
          <div className='space-y-3'>
            {focusEvents.length ? (
              focusEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onToggle={handleToggleEvent}
                />
              ))
            ) : (
              <EmptyState message='Nema aktivnih prioriteta za danas.' />
            )}
          </div>
        </FocusPanel>

        <FocusPanel title='Brzi pregled'>
          <div className='space-y-4'>
            <FocusInsight
              icon={FaExclamationTriangle}
              title='Zakašnjene obaveze'
              text={
                overdueEvents.length
                  ? `${overdueEvents.length} nezavršene obaveze čekaju da se zatvore.`
                  : 'Nema zakašnjenih obaveza.'
              }
            />
            <FocusInsight
              icon={FaLayerGroup}
              title='Balans nedelje'
              text={categoryBalanceMessage}
            />
            <Link
              to='/planners'
              className='inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300'
            >
              Otvori planere
              <FaArrowRight aria-hidden='true' />
            </Link>
          </div>
        </FocusPanel>
      </section>

      <section className='grid gap-5 xl:grid-cols-[0.9fr_1.1fr]'>
        <FocusPanel title='Zakašnjeno'>
          <div className='space-y-3'>
            {overdueEvents.length ? (
              overdueEvents.slice(0, 5).map((event) => (
                <OverdueEventRow
                  key={event.id}
                  event={event}
                  onToggle={handleToggleEvent}
                />
              ))
            ) : (
              <EmptyState message='Sve prethodne obaveze su pod kontrolom.' />
            )}
          </div>
        </FocusPanel>

        <FocusPanel title='Narednih 7 dana'>
          <div className='space-y-3'>
            {nextSevenDays.map((date) => (
              <DayFocusRow
                key={toDateKey(date)}
                date={date}
                events={nextEventsByDate[toDateKey(date)] ?? []}
                isToday={toDateKey(date) === toDateKey(today)}
              />
            ))}
          </div>
        </FocusPanel>
      </section>

      <AddEventModal
        defaultCategoryId='work'
        defaultDateTime={toDateTimeLocalValue(today)}
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onSubmit={handleCreateEvent}
      />
    </div>
  );
};

interface FocusHeroStatProps {
  label: string;
  value: number | string;
}

const FocusHeroStat = ({ label, value }: FocusHeroStatProps) => (
  <div className='rounded-xl bg-white/20 px-3 py-4 text-center'>
    <div className='text-2xl font-bold'>{value}</div>
    <div className='mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-indigo-100'>
      {label}
    </div>
  </div>
);

interface FocusMetricCardProps {
  icon: IconType;
  label: string;
  value: number;
  tone: 'amber' | 'emerald' | 'indigo';
}

const metricToneClasses: Record<FocusMetricCardProps['tone'], string> = {
  amber: 'bg-amber-100 text-amber-500',
  emerald: 'bg-emerald-100 text-emerald-500',
  indigo: 'bg-indigo-100 text-indigo-500',
};

const FocusMetricCard = ({
  icon: Icon,
  label,
  tone,
  value,
}: FocusMetricCardProps) => (
  <article className='rounded-2xl border border-indigo-50 bg-white p-5 shadow-[0_4px_24px_rgba(99,102,241,0.08)]'>
    <div className='flex items-center justify-between gap-4'>
      <div>
        <p className='text-xs font-bold uppercase tracking-[0.08em] text-slate-400'>
          {label}
        </p>
        <p className='mt-2 text-3xl font-bold text-indigo-950'>{value}</p>
      </div>
      <span
        className={[
          'flex h-12 w-12 items-center justify-center rounded-2xl text-xl',
          metricToneClasses[tone],
        ].join(' ')}
      >
        <Icon aria-hidden='true' />
      </span>
    </div>
  </article>
);

interface FocusPanelProps {
  action?: ReactNode;
  children: ReactNode;
  title: string;
}

const FocusPanel = ({ action, children, title }: FocusPanelProps) => (
  <section className='rounded-2xl border border-indigo-50 bg-white shadow-[0_4px_24px_rgba(99,102,241,0.08)]'>
    <header className='flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4'>
      <h2 className='text-base font-bold text-indigo-950'>{title}</h2>
      {action}
    </header>
    <div className='p-5'>{children}</div>
  </section>
);

interface FocusInsightProps {
  icon: IconType;
  text: string;
  title: string;
}

const FocusInsight = ({ icon: Icon, text, title }: FocusInsightProps) => (
  <article className='rounded-2xl bg-indigo-50 p-4'>
    <div className='flex gap-3'>
      <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-500'>
        <Icon aria-hidden='true' />
      </span>
      <div>
        <h3 className='text-sm font-bold text-indigo-950'>{title}</h3>
        <p className='mt-1 text-sm leading-5 text-slate-500'>{text}</p>
      </div>
    </div>
  </article>
);

interface OverdueEventRowProps {
  event: PlannerEvent;
  onToggle: (event: PlannerEvent) => void;
}

const OverdueEventRow = ({ event, onToggle }: OverdueEventRowProps) => {
  const category = getEventCategory(event.categoryId);

  return (
    <article className='flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-3'>
      <button
        type='button'
        onClick={() => onToggle(event)}
        className='flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-500 transition hover:bg-emerald-500 hover:text-white'
        aria-label='Označi zakašnjeni događaj kao završen'
      >
        <FaCheckCircle aria-hidden='true' />
      </button>
      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500'>
          <span style={{ color: category.color }}>{category.label}</span>
          <span>{shortDateFormatter.format(parseEventDate(event))}</span>
          <span>{getEventTime(event)}</span>
        </div>
        <h3 className='mt-1 truncate text-sm font-bold text-indigo-950'>
          {event.title}
        </h3>
      </div>
    </article>
  );
};

interface DayFocusRowProps {
  date: Date;
  events: PlannerEvent[];
  isToday: boolean;
}

const DayFocusRow = ({ date, events, isToday }: DayFocusRowProps) => (
  <article className='grid gap-3 rounded-xl border border-slate-200 p-3 sm:grid-cols-[120px_1fr]'>
    <div>
      <p className='text-xs font-bold uppercase tracking-[0.08em] text-slate-400'>
        {isToday ? 'Danas' : weekdayFormatter.format(date)}
      </p>
      <p className='mt-1 text-sm font-bold text-indigo-950'>
        {shortDateFormatter.format(date)}
      </p>
    </div>
    <div className='space-y-2'>
      {events.length ? (
        events.slice(0, 3).map((event) => {
          const category = getEventCategory(event.categoryId);

          return (
            <div
              key={event.id}
              className='flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2'
            >
              <div className='min-w-0'>
                <p className='truncate text-sm font-semibold text-indigo-950'>
                  {event.title}
                </p>
                <p className='mt-0.5 text-xs text-slate-400'>
                  {getEventTime(event)} · {category.label}
                </p>
              </div>
              <span
                className='h-2.5 w-2.5 shrink-0 rounded-full'
                style={{ backgroundColor: category.color }}
              />
            </div>
          );
        })
      ) : (
        <p className='rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-400'>
          Nema aktivnih obaveza.
        </p>
      )}
      {events.length > 3 ? (
        <p className='px-1 text-xs font-semibold text-indigo-500'>
          +{events.length - 3} još
        </p>
      ) : null}
    </div>
  </article>
);

export default Focus;
