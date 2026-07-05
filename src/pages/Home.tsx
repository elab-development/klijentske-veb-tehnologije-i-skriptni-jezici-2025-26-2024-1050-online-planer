import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import AddEventModal, {
  type AddEventFormValues,
} from '../components/planners/AddEventModal';
import DashboardStatCards from '../components/home/DashboardStatCards';
import PlannerShortcutCards from '../components/home/PlannerShortcutCards';
import TodayEventsPanel from '../components/home/TodayEventsPanel';
import UpcomingHolidaysCard from '../components/home/UpcomingHolidaysCard';
import WelcomeBanner from '../components/home/WelcomeBanner';
import { useAuth } from '../contexts/useAuth';
import { usePublicHolidays } from '../hooks/usePublicHolidays';
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
} from '../utils/plannerDate';
import { getEventsByDate } from '../utils/plannerEvents';

const Home = () => {
  const { currentUser } = useAuth();
  const today = useMemo(() => startOfDay(new Date()), []);
  const [currentTimestamp] = useState(() => Date.now());
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [events, setEvents] = useState<PlannerEvent[]>(() =>
    currentUser ? plannerEventStorage.seedUserEvents(currentUser.id) : [],
  );
  const holidays = usePublicHolidays([today.getFullYear()]);

  const eventsByDate = useMemo(() => getEventsByDate(events), [events]);
  const todayEvents = eventsByDate[toDateKey(today)] ?? [];
  const yesterdayEvents = eventsByDate[toDateKey(addDays(today, -1))] ?? [];
  const completedToday = todayEvents.filter((event) => event.isCompleted).length;

  const nextEvent = useMemo(
    () =>
      events.find(
        (event) =>
          !event.isCompleted &&
          parseEventDate(event).getTime() >= currentTimestamp,
      ),
    [currentTimestamp, events],
  );

  const upcomingHolidays = useMemo(
    () =>
      holidays.filter(
        (holiday) => new Date(holiday.date).getTime() >= today.getTime(),
      ),
    [holidays, today],
  );

  const nextHoliday = upcomingHolidays[0];

  const handleToggleEvent = (event: PlannerEvent) => {
    if (!currentUser) {
      return;
    }

    const updatedEvent = plannerEventStorage.setCompleted(
      event.id,
      currentUser.id,
      !event.isCompleted,
    );

    if (!updatedEvent) {
      return;
    }

    setEvents(plannerEventStorage.loadByUser(currentUser.id));
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

      setEvents(plannerEventStorage.loadByUser(currentUser.id));
      setIsAddEventModalOpen(false);
      toast.success('Događaj je dodat.');
    } catch {
      toast.error('Događaj nije dodat. Proverite unete podatke.');
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className='space-y-7'>
      <WelcomeBanner
        currentUser={currentUser}
        nextEvent={nextEvent}
        today={today}
        todayEventsCount={todayEvents.length}
        onAddEvent={() => setIsAddEventModalOpen(true)}
      />

      <DashboardStatCards
        completedToday={completedToday}
        nextEventLabel={nextEvent?.title ?? 'Nema narednog događaja'}
        nextEventTime={nextEvent ? getEventTime(nextEvent) : '-'}
        nextHolidayDate={
          nextHoliday ? shortDateFormatter.format(new Date(nextHoliday.date)) : '-'
        }
        nextHolidayLabel={nextHoliday?.localName ?? 'Nema podataka'}
        todayEventsCount={todayEvents.length}
        yesterdayDelta={todayEvents.length - yesterdayEvents.length}
      />

      <PlannerShortcutCards />

      <section className='grid gap-5 xl:grid-cols-[1fr_340px]'>
        <TodayEventsPanel
          events={todayEvents}
          onAddEvent={() => setIsAddEventModalOpen(true)}
          onToggleEvent={handleToggleEvent}
        />
        <UpcomingHolidaysCard holidays={upcomingHolidays} />
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

export default Home;
