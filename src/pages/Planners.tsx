import { useMemo, useState } from 'react';

import CategoryFilterBar from '../components/planners/CategoryFilterBar';
import DailyPlannerView from '../components/planners/DailyPlannerView';
import MonthlyPlannerView from '../components/planners/MonthlyPlannerView';
import PlannerPeriodToolbar from '../components/planners/PlannerPeriodToolbar';
import PlannerViewTabs from '../components/planners/PlannerViewTabs';
import WeeklyPlannerView from '../components/planners/WeeklyPlannerView';
import { useAuth } from '../contexts/useAuth';
import { eventCategoryIds } from '../data/eventCategories';
import { usePublicHolidays } from '../hooks/usePublicHolidays';
import type { PlannerEvent } from '../models/PlannerEvent';
import { plannerEventStorage } from '../services/PlannerEventStorage';
import { getHolidaysByDate, getHolidayYears } from '../utils/holidayUtils';
import {
  addDays,
  addMonths,
  getWeekDays,
  parseEventDate,
  startOfDay,
  toDateKey,
} from '../utils/plannerDate';
import {
  filterEventsByCategory,
  getEventsByDate,
  getInitialReferenceDate,
  getVisibleDates,
} from '../utils/plannerEvents';
import type {
  EventCategoryFilter,
  PlannerView,
} from '../utils/plannerTypes';

const Planners = () => {
  const { currentUser } = useAuth();
  const [activeView, setActiveView] = useState<PlannerView>('weekly');
  const [activeCategory, setActiveCategory] =
    useState<EventCategoryFilter>('all');
  const [events, setEvents] = useState<PlannerEvent[]>(() =>
    currentUser ? plannerEventStorage.seedUserEvents(currentUser.id) : [],
  );
  const [referenceDate, setReferenceDate] = useState(() =>
    getInitialReferenceDate(
      currentUser ? plannerEventStorage.loadByUser(currentUser.id) : [],
    ),
  );

  const visibleDates = useMemo(
    () => getVisibleDates(activeView, referenceDate),
    [activeView, referenceDate],
  );

  const visibleDateKeys = useMemo(
    () => new Set(visibleDates.map(toDateKey)),
    [visibleDates],
  );
  const visibleHolidayYears = useMemo(
    () => getHolidayYears(visibleDates),
    [visibleDates],
  );
  const holidays = usePublicHolidays(visibleHolidayYears);
  const holidaysByDate = useMemo(
    () => getHolidaysByDate(holidays),
    [holidays],
  );

  const visibleEventsWithoutCategoryFilter = useMemo(
    () =>
      events.filter((event) =>
        visibleDateKeys.has(toDateKey(parseEventDate(event))),
      ),
    [events, visibleDateKeys],
  );

  const filteredEvents = useMemo(
    () => filterEventsByCategory(events, activeCategory),
    [activeCategory, events],
  );

  const eventsByDate = useMemo(
    () => getEventsByDate(filteredEvents),
    [filteredEvents],
  );

  const visibleEvents = useMemo(
    () =>
      filteredEvents.filter((event) =>
        visibleDateKeys.has(toDateKey(parseEventDate(event))),
      ),
    [filteredEvents, visibleDateKeys],
  );

  const categoryCounts = useMemo(
    () =>
      eventCategoryIds.reduce<Record<EventCategoryFilter, number>>(
        (counts, categoryId) => ({
          ...counts,
          [categoryId]: visibleEventsWithoutCategoryFilter.filter(
            (event) => event.categoryId === categoryId,
          ).length,
        }),
        {
          all: visibleEventsWithoutCategoryFilter.length,
          work: 0,
          personal: 0,
          health: 0,
          study: 0,
          social: 0,
        },
      ),
    [visibleEventsWithoutCategoryFilter],
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

      <CategoryFilterBar
        activeCategory={activeCategory}
        counts={categoryCounts}
        onChange={setActiveCategory}
      />

      {activeView === 'daily' ? (
        <DailyPlannerView
          events={eventsByDate[toDateKey(referenceDate)] ?? []}
          holidays={holidaysByDate[toDateKey(referenceDate)] ?? []}
          referenceDate={referenceDate}
          onToggleEvent={handleToggleEvent}
        />
      ) : null}

      {activeView === 'weekly' ? (
        <WeeklyPlannerView
          eventsByDate={eventsByDate}
          holidaysByDate={holidaysByDate}
          referenceDate={referenceDate}
          onToggleEvent={handleToggleEvent}
        />
      ) : null}

      {activeView === 'monthly' ? (
        <MonthlyPlannerView
          eventsByDate={eventsByDate}
          holidaysByDate={holidaysByDate}
          referenceDate={referenceDate}
          onToggleEvent={handleToggleEvent}
        />
      ) : null}
    </div>
  );
};

export default Planners;
