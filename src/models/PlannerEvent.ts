import { isEventCategoryId } from '../data/eventCategories';
import type {
  CreatePlannerEventInput,
  PlannerEventProps,
  UpdatePlannerEventInput,
} from '../types/PlannerEvent';

const createPlannerEventId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `event-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const requireTitle = (title: string) => {
  const normalizedTitle = title.trim();

  if (!normalizedTitle) {
    throw new Error('Naziv dogadjaja je obavezan.');
  }

  return normalizedTitle;
};

const requireValidDateTime = (dateTime: string) => {
  const normalizedDateTime = dateTime.trim();

  if (!normalizedDateTime || Number.isNaN(new Date(normalizedDateTime).getTime())) {
    throw new Error('Datum i vreme dogadjaja nisu ispravni.');
  }

  return normalizedDateTime;
};

export class PlannerEvent {
  private props: PlannerEventProps;

  private constructor(props: PlannerEventProps) {
    this.props = {
      ...props,
      title: requireTitle(props.title),
      dateTime: requireValidDateTime(props.dateTime),
      note: props.note.trim(),
      isCompleted: props.isCompleted,
    };

    if (!isEventCategoryId(this.props.categoryId)) {
      throw new Error('Kategorija dogadjaja nije podrzana.');
    }
  }

  static create(input: CreatePlannerEventInput) {
    const now = new Date().toISOString();

    return new PlannerEvent({
      id: createPlannerEventId(),
      userId: input.userId,
      title: input.title,
      dateTime: input.dateTime,
      categoryId: input.categoryId,
      note: input.note ?? '',
      isCompleted: input.isCompleted ?? false,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromJSON(props: PlannerEventProps) {
    return new PlannerEvent(props);
  }

  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  get title() {
    return this.props.title;
  }

  get dateTime() {
    return this.props.dateTime;
  }

  get categoryId() {
    return this.props.categoryId;
  }

  get note() {
    return this.props.note;
  }

  get isCompleted() {
    return this.props.isCompleted;
  }

  belongsTo(userId: number) {
    return this.props.userId === userId;
  }

  markCompleted() {
    this.setCompleted(true);
  }

  markIncomplete() {
    this.setCompleted(false);
  }

  setCompleted(isCompleted: boolean) {
    this.props = {
      ...this.props,
      isCompleted,
      updatedAt: new Date().toISOString(),
    };
  }

  update(input: UpdatePlannerEventInput) {
    this.props = {
      ...this.props,
      title:
        input.title === undefined ? this.props.title : requireTitle(input.title),
      dateTime:
        input.dateTime === undefined
          ? this.props.dateTime
          : requireValidDateTime(input.dateTime),
      categoryId: input.categoryId ?? this.props.categoryId,
      note: input.note === undefined ? this.props.note : input.note.trim(),
      isCompleted: input.isCompleted ?? this.props.isCompleted,
      updatedAt: new Date().toISOString(),
    };

    if (!isEventCategoryId(this.props.categoryId)) {
      throw new Error('Kategorija dogadjaja nije podrzana.');
    }
  }

  toJSON(): PlannerEventProps {
    return { ...this.props };
  }
}
