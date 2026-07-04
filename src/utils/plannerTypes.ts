import type { PlannerEvent } from '../models/PlannerEvent';
import type { EventCategoryId } from '../types/EventCategory';

export type PlannerView = 'daily' | 'weekly' | 'monthly';

export type EventCategoryFilter = EventCategoryId | 'all';

export type EventsByDate = Record<string, PlannerEvent[]>;
