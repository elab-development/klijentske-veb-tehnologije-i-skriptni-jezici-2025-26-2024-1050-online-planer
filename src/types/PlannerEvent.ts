import type { EventCategoryId } from './EventCategory';

export interface PlannerEventProps {
  id: string;
  userId: number;
  title: string;
  dateTime: string;
  categoryId: EventCategoryId;
  note: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlannerEventInput {
  userId: number;
  title: string;
  dateTime: string;
  categoryId: EventCategoryId;
  note?: string;
  isCompleted?: boolean;
}

export interface UpdatePlannerEventInput {
  title?: string;
  dateTime?: string;
  categoryId?: EventCategoryId;
  note?: string;
  isCompleted?: boolean;
}

export interface PlannerEventStorageSnapshot {
  version: number;
  events: PlannerEventProps[];
  seededUserIds: number[];
}
