import type { PlannerEvent } from '../models/PlannerEvent';

export type PlannerView = 'daily' | 'weekly' | 'monthly';

export type EventsByDate = Record<string, PlannerEvent[]>;

