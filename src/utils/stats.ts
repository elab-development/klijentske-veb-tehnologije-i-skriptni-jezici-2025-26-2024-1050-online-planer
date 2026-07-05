import { eventCategories } from '../data/eventCategories';
import type { PlannerEvent } from '../models/PlannerEvent';
import {
  addDays,
  addMonths,
  getWeekDays,
  monthFormatter,
  parseEventDate,
  shortDateFormatter,
  startOfDay,
  startOfMonth,
  toDateKey,
  weekdayFormatter,
} from './plannerDate';

export type StatsPeriod = 'daily' | 'weekly' | 'monthly';

export interface StatsBucket {
  label: string;
  total: number;
  completed: number;
}

export interface CategoryStat {
  id: string;
  label: string;
  color: string;
  lightColor: string;
  total: number;
  completed: number;
  percent: number;
}

export interface TrendPoint {
  label: string;
  percent: number;
}

export interface StatsData {
  periodTitle: string;
  total: number;
  completed: number;
  completionPercent: number;
  previousCompletionPercent: number;
  productivityDelta: number;
  bestBucketLabel: string;
  bestBucketCompleted: number;
  buckets: StatsBucket[];
  categoryStats: CategoryStat[];
  trend: TrendPoint[];
}

const dailySlots = [
  { label: 'Jutro', startHour: 6, endHour: 12 },
  { label: 'Podne', startHour: 12, endHour: 16 },
  { label: 'Popodne', startHour: 16, endHour: 20 },
  { label: 'Veče', startHour: 20, endHour: 24 },
];

const getCompletionPercent = (events: PlannerEvent[]) => {
  if (!events.length) {
    return 0;
  }

  const completed = events.filter((event) => event.isCompleted).length;
  return Math.round((completed / events.length) * 100);
};

const isInRange = (event: PlannerEvent, start: Date, end: Date) => {
  const eventTime = parseEventDate(event).getTime();
  return eventTime >= start.getTime() && eventTime < end.getTime();
};

const getMonthDays = (referenceDate: Date) => {
  const monthStart = startOfMonth(referenceDate);
  const nextMonthStart = addMonths(monthStart, 1);
  const days: Date[] = [];
  let currentDate = monthStart;

  while (currentDate.getTime() < nextMonthStart.getTime()) {
    days.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }

  return days;
};

const getPeriodRange = (period: StatsPeriod, referenceDate: Date) => {
  if (period === 'daily') {
    const start = startOfDay(referenceDate);
    return { start, end: addDays(start, 1) };
  }

  if (period === 'weekly') {
    const weekDays = getWeekDays(referenceDate);
    return { start: weekDays[0], end: addDays(weekDays[6], 1) };
  }

  const start = startOfMonth(referenceDate);
  return { start, end: addMonths(start, 1) };
};

const getPreviousPeriodRange = (period: StatsPeriod, referenceDate: Date) => {
  if (period === 'daily') {
    return getPeriodRange(period, addDays(referenceDate, -1));
  }

  if (period === 'weekly') {
    return getPeriodRange(period, addDays(referenceDate, -7));
  }

  return getPeriodRange(period, addMonths(referenceDate, -1));
};

const getPeriodEvents = (
  events: PlannerEvent[],
  period: StatsPeriod,
  referenceDate: Date,
) => {
  const { end, start } = getPeriodRange(period, referenceDate);
  return events.filter((event) => isInRange(event, start, end));
};

const getPeriodTitle = (period: StatsPeriod, referenceDate: Date) => {
  if (period === 'daily') {
    return shortDateFormatter.format(referenceDate);
  }

  if (period === 'weekly') {
    const weekDays = getWeekDays(referenceDate);
    return `${shortDateFormatter.format(weekDays[0])} - ${shortDateFormatter.format(
      weekDays[6],
    )}`;
  }

  return monthFormatter.format(referenceDate);
};

const getDailyBuckets = (events: PlannerEvent[], referenceDate: Date) =>
  dailySlots.map(({ endHour, label, startHour }) => {
    const slotEvents = events.filter((event) => {
      const eventDate = parseEventDate(event);
      return (
        toDateKey(eventDate) === toDateKey(referenceDate) &&
        eventDate.getHours() >= startHour &&
        eventDate.getHours() < endHour
      );
    });

    return {
      label,
      total: slotEvents.length,
      completed: slotEvents.filter((event) => event.isCompleted).length,
    };
  });

const getWeeklyBuckets = (events: PlannerEvent[], referenceDate: Date) =>
  getWeekDays(referenceDate).map((date) => {
    const dayEvents = events.filter(
      (event) => toDateKey(parseEventDate(event)) === toDateKey(date),
    );

    return {
      label: weekdayFormatter.format(date),
      total: dayEvents.length,
      completed: dayEvents.filter((event) => event.isCompleted).length,
    };
  });

const getMonthlyBuckets = (events: PlannerEvent[], referenceDate: Date) =>
  getMonthDays(referenceDate).map((date) => {
    const dayEvents = events.filter(
      (event) => toDateKey(parseEventDate(event)) === toDateKey(date),
    );

    return {
      label: String(date.getDate()),
      total: dayEvents.length,
      completed: dayEvents.filter((event) => event.isCompleted).length,
    };
  });

const getBuckets = (
  events: PlannerEvent[],
  period: StatsPeriod,
  referenceDate: Date,
) => {
  if (period === 'daily') {
    return getDailyBuckets(events, referenceDate);
  }

  if (period === 'weekly') {
    return getWeeklyBuckets(events, referenceDate);
  }

  return getMonthlyBuckets(events, referenceDate);
};

const getCategoryStats = (events: PlannerEvent[]) =>
  eventCategories.map((category) => {
    const categoryEvents = events.filter(
      (event) => event.categoryId === category.id,
    );
    const completed = categoryEvents.filter((event) => event.isCompleted).length;

    return {
      id: category.id,
      label: category.label,
      color: category.color,
      lightColor: category.lightColor,
      total: categoryEvents.length,
      completed,
      percent: getCompletionPercent(categoryEvents),
    };
  });

const getTrendReferenceDate = (
  period: StatsPeriod,
  referenceDate: Date,
  offset: number,
) => {
  if (period === 'daily') {
    return addDays(referenceDate, offset);
  }

  if (period === 'weekly') {
    return addDays(referenceDate, offset * 7);
  }

  return addMonths(referenceDate, offset);
};

const getTrendLabel = (period: StatsPeriod, referenceDate: Date) => {
  if (period === 'monthly') {
    return monthFormatter.format(referenceDate).split(' ')[0];
  }

  return shortDateFormatter.format(referenceDate);
};

const getTrend = (
  events: PlannerEvent[],
  period: StatsPeriod,
  referenceDate: Date,
) =>
  [-3, -2, -1, 0].map((offset) => {
    const pointDate = getTrendReferenceDate(period, referenceDate, offset);
    const periodEvents = getPeriodEvents(events, period, pointDate);

    return {
      label: getTrendLabel(period, pointDate),
      percent: getCompletionPercent(periodEvents),
    };
  });

export const getStatsData = (
  events: PlannerEvent[],
  period: StatsPeriod,
  referenceDate: Date,
): StatsData => {
  const periodEvents = getPeriodEvents(events, period, referenceDate);
  const { end, start } = getPreviousPeriodRange(period, referenceDate);
  const previousPeriodEvents = events.filter((event) =>
    isInRange(event, start, end),
  );
  const buckets = getBuckets(periodEvents, period, referenceDate);
  const bestBucket = buckets.reduce(
    (best, bucket) => (bucket.completed > best.completed ? bucket : best),
    buckets[0] ?? { label: '-', total: 0, completed: 0 },
  );
  const completed = periodEvents.filter((event) => event.isCompleted).length;
  const completionPercent = getCompletionPercent(periodEvents);
  const previousCompletionPercent = getCompletionPercent(previousPeriodEvents);

  return {
    periodTitle: getPeriodTitle(period, referenceDate),
    total: periodEvents.length,
    completed,
    completionPercent,
    previousCompletionPercent,
    productivityDelta: completionPercent - previousCompletionPercent,
    bestBucketLabel: bestBucket.label,
    bestBucketCompleted: bestBucket.completed,
    buckets,
    categoryStats: getCategoryStats(periodEvents),
    trend: getTrend(events, period, referenceDate),
  };
};

