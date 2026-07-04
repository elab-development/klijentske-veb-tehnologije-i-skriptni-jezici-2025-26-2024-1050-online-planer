import type {
  EventCategoryDefinition,
  EventCategoryId,
} from '../types/EventCategory';

export const eventCategories: readonly EventCategoryDefinition[] = [
  {
    id: 'work',
    label: 'Posao',
    color: '#6366f1',
    lightColor: '#ede9fe',
    shortCode: 'wk',
  },
  {
    id: 'personal',
    label: 'Lično',
    color: '#f59e0b',
    lightColor: '#fef3c7',
    shortCode: 'pr',
  },
  {
    id: 'health',
    label: 'Zdravlje',
    color: '#10b981',
    lightColor: '#d1fae5',
    shortCode: 'hl',
  },
  {
    id: 'study',
    label: 'Učenje',
    color: '#f43f5e',
    lightColor: '#ffe4e6',
    shortCode: 'st',
  },
  {
    id: 'social',
    label: 'Društvo',
    color: '#8b5cf6',
    lightColor: '#ede9fe',
    shortCode: 'so',
  },
];

export const eventCategoryIds = eventCategories.map(
  (category) => category.id,
) as EventCategoryId[];

export const isEventCategoryId = (value: string): value is EventCategoryId =>
  eventCategoryIds.includes(value as EventCategoryId);

export const getEventCategory = (
  categoryId: EventCategoryId,
): EventCategoryDefinition =>
  eventCategories.find((category) => category.id === categoryId) ??
  eventCategories[0];
