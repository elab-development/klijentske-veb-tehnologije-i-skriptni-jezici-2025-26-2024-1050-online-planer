import type { PlannerEvent } from '../models/PlannerEvent';
import {
  getMonthGridDays,
  getWeekDays,
  parseEventDate,
  startOfDay,
  toDateKey,
} from './plannerDate';
import type { EventsByDate, PlannerView } from './plannerTypes';

export const getInitialReferenceDate = (events: PlannerEvent[]) => {
  const today = startOfDay(new Date());
  const todayKey = toDateKey(today);
  const hasEventsToday = events.some(
    (event) => toDateKey(parseEventDate(event)) === todayKey,
  );

  if (hasEventsToday || !events[0]) {
    return today;
  }

  return startOfDay(parseEventDate(events[0]));
};

export const getEventsByDate = (events: PlannerEvent[]) =>
  events.reduce<EventsByDate>((groups, event) => {
    const dateKey = toDateKey(parseEventDate(event));

    return {
      ...groups,
      [dateKey]: [...(groups[dateKey] ?? []), event],
    };
  }, {});

export const getVisibleDates = (view: PlannerView, referenceDate: Date) => {
  if (view === 'daily') {
    return [startOfDay(referenceDate)];
  }

  if (view === 'weekly') {
    return getWeekDays(referenceDate);
  }

  return getMonthGridDays(referenceDate).filter(
    (date) => date.getMonth() === referenceDate.getMonth(),
  );
};

export const getPlannerEmptyMessage = (view: PlannerView) => {
  if (view === 'daily') {
    return 'Nema događaja za ovaj dan.';
  }

  if (view === 'weekly') {
    return 'Nema događaja za ovu nedelju.';
  }

  return 'Nema događaja za ovaj mesec.';
};

