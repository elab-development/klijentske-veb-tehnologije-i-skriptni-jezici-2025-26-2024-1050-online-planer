import { predefinedPlannerEvents } from '../data/plannerEvents';
import { PlannerEvent } from '../models/PlannerEvent';
import type {
  CreatePlannerEventInput,
  PlannerEventProps,
  PlannerEventStorageSnapshot,
  UpdatePlannerEventInput,
} from '../types/PlannerEvent';

export interface PlannerEventStorageDriver {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

interface PlannerEventStorageOptions {
  key?: string;
  driver?: PlannerEventStorageDriver;
}

const defaultSnapshot = (): PlannerEventStorageSnapshot => ({
  version: 1,
  events: [],
  seededUserIds: [],
});

const byDateTime = (a: PlannerEvent, b: PlannerEvent) =>
  new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();

export class PlannerEventStorage {
  private key: string;
  private version = 1;
  private driver?: PlannerEventStorageDriver;

  constructor(options: PlannerEventStorageOptions = {}) {
    this.key = options.key ?? 'planit.events.v1';
    this.driver = options.driver;
  }

  private getStorage() {
    if (this.driver) {
      return this.driver;
    }

    try {
      return typeof window !== 'undefined' ? window.localStorage : null;
    } catch {
      return null;
    }
  }

  private readSnapshot(): PlannerEventStorageSnapshot {
    const storage = this.getStorage();

    if (!storage) {
      return defaultSnapshot();
    }

    const raw = storage.getItem(this.key);

    if (!raw) {
      return defaultSnapshot();
    }

    try {
      const parsed = JSON.parse(raw) as Partial<PlannerEventStorageSnapshot>;

      return {
        version: typeof parsed.version === 'number' ? parsed.version : this.version,
        events: Array.isArray(parsed.events) ? parsed.events : [],
        seededUserIds: Array.isArray(parsed.seededUserIds)
          ? parsed.seededUserIds
          : [],
      };
    } catch {
      return defaultSnapshot();
    }
  }

  private writeSnapshot(snapshot: PlannerEventStorageSnapshot) {
    const storage = this.getStorage();

    if (!storage) {
      return;
    }

    storage.setItem(
      this.key,
      JSON.stringify({
        ...snapshot,
        version: this.version,
      }),
    );
  }

  loadAll() {
    return this.readSnapshot()
      .events.map((event) => PlannerEvent.fromJSON(event))
      .sort(byDateTime);
  }

  loadByUser(userId: number) {
    return this.loadAll().filter((event) => event.belongsTo(userId));
  }

  saveAll(events: PlannerEvent[]) {
    const snapshot = this.readSnapshot();

    this.writeSnapshot({
      ...snapshot,
      events: events.map((event) => event.toJSON()),
    });
  }

  create(input: CreatePlannerEventInput) {
    const event = PlannerEvent.create(input);
    const events = this.loadAll();

    this.saveAll([...events, event]);

    return event;
  }

  update(eventId: string, userId: number, input: UpdatePlannerEventInput) {
    const events = this.loadAll();
    const event = events.find(
      (candidate) => candidate.id === eventId && candidate.belongsTo(userId),
    );

    if (!event) {
      return null;
    }

    event.update(input);
    this.saveAll(events);

    return event;
  }

  setCompleted(eventId: string, userId: number, isCompleted: boolean) {
    return this.update(eventId, userId, { isCompleted });
  }

  delete(eventId: string, userId: number) {
    const events = this.loadAll();
    const nextEvents = events.filter(
      (event) => event.id !== eventId || !event.belongsTo(userId),
    );

    this.saveAll(nextEvents);

    return nextEvents.length !== events.length;
  }

  seedUserEvents(userId: number) {
    const snapshot = this.readSnapshot();

    if (snapshot.seededUserIds.includes(userId)) {
      return this.loadByUser(userId);
    }

    const existingIds = new Set(snapshot.events.map((event) => event.id));
    const userSeedEvents = predefinedPlannerEvents.filter(
      (event) => event.userId === userId && !existingIds.has(event.id),
    );

    this.writeSnapshot({
      ...snapshot,
      events: [...snapshot.events, ...userSeedEvents],
      seededUserIds: [...snapshot.seededUserIds, userId],
    });

    return this.loadByUser(userId);
  }

  import(events: PlannerEventProps[]) {
    this.saveAll(events.map((event) => PlannerEvent.fromJSON(event)));
  }

  clear() {
    const storage = this.getStorage();

    if (!storage) {
      return;
    }

    storage.removeItem(this.key);
  }
}

export const plannerEventStorage = new PlannerEventStorage();
