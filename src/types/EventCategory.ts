export type EventCategoryId =
  | 'work'
  | 'personal'
  | 'health'
  | 'study'
  | 'social';

export interface EventCategoryDefinition {
  id: EventCategoryId;
  label: string;
  color: string;
  lightColor: string;
  shortCode: string;
}

