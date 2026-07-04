import { useMemo, useState } from 'react';

import CategoryLegend from '../components/planners/CategoryLegend';
import DailyPlannerView from '../components/planners/DailyPlannerView';
import MonthlyPlannerView from '../components/planners/MonthlyPlannerView';
import PlannerPeriodToolbar from '../components/planners/PlannerPeriodToolbar';
import PlannerViewTabs from '../components/planners/PlannerViewTabs';
import WeeklyPlannerView from '../components/planners/WeeklyPlannerView';
import { useAuth } from '../contexts/useAuth';
import type { PlannerEvent } from '../models/PlannerEvent';
import { plannerEventStorage } from '../services/PlannerEventStorage';
import {
  addDays,
  addMonths,
  getWeekDays,
  parseEventDate,
  startOfDay,
  toDateKey,
} from '../utils/plannerDate';
import {
  getEventsByDate,
  getInitialReferenceDate,
  getVisibleDates,
} from '../utils/plannerEvents';
import type { PlannerView } from '../utils/plannerTypes';

const Planners = () => {
  const { currentUser } = useAuth();
  const [activeView, setActiveView] = useState<PlannerView>('weekly');
  const [events, setEvents] = useState<PlannerEvent[]>(() =>
    currentUser ? plannerEventStorage.seedUserEvents(currentUser.id) : [],
  );
  const [referenceDate, setReferenceDate] = useState(() =>
    getInitialReferenceDate(
      currentUser ? plannerEventStorage.loadByUser(currentUser.id) : [],
    ),
  );

  const eventsByDate = useMemo(() => getEventsByDate(events), [events]);

  const visibleDates = useMemo(
    () => getVisibleDates(activeView, referenceDate),
    [activeView, referenceDate],
  );

  const visibleDateKeys = useMemo(
    () => new Set(visibleDates.map(toDateKey)),
    [visibleDates],
  );

  const visibleEvents = useMemo(
    () =>
      events.filter((event) =>
        visibleDateKeys.has(toDateKey(parseEventDate(event))),
      ),
    [events, visibleDateKeys],
  );

  const viewEventCounts = useMemo<Record<PlannerView, number>>(
    () => ({
      daily: eventsByDate[toDateKey(referenceDate)]?.length ?? 0,
      weekly: getWeekDays(referenceDate).reduce(
        (total, date) => total + (eventsByDate[toDateKey(date)]?.length ?? 0),
        0,
      ),
      monthly: getVisibleDates('monthly', referenceDate).reduce(
        (total, date) => total + (eventsByDate[toDateKey(date)]?.length ?? 0),
        0,
      ),
    }),
    [eventsByDate, referenceDate],
  );

  const completedEventsCount = visibleEvents.filter(
    (event) => event.isCompleted,
  ).length;

  const handleMovePeriod = (direction: -1 | 1) => {
    setReferenceDate((currentDate) => {
      if (activeView === 'daily') {
        return addDays(currentDate, direction);
      }

      if (activeView === 'weekly') {
        return addDays(currentDate, direction * 7);
      }

      return addMonths(currentDate, direction);
    });
  };

  const handleToday = () => {
    setReferenceDate(startOfDay(new Date()));
  };

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

  return (
    <div className='space-y-6'>
      <PlannerViewTabs
        activeView={activeView}
        counts={viewEventCounts}
        onChange={setActiveView}
      />

      <PlannerPeriodToolbar
        activeView={activeView}
        completedEventsCount={completedEventsCount}
        referenceDate={referenceDate}
        totalEventsCount={visibleEvents.length}
        onMovePeriod={handleMovePeriod}
        onToday={handleToday}
      />

      <CategoryLegend />

      {activeView === 'daily' ? (
        <DailyPlannerView
          events={eventsByDate[toDateKey(referenceDate)] ?? []}
          referenceDate={referenceDate}
          onToggleEvent={handleToggleEvent}
        />
      ) : null}

      {activeView === 'weekly' ? (
        <WeeklyPlannerView
          eventsByDate={eventsByDate}
          referenceDate={referenceDate}
          onToggleEvent={handleToggleEvent}
        />
      ) : null}

      {activeView === 'monthly' ? (
        <MonthlyPlannerView
          eventsByDate={eventsByDate}
          referenceDate={referenceDate}
          onToggleEvent={handleToggleEvent}
        />
      ) : null}
    </div>
  );
};

export default Planners;
