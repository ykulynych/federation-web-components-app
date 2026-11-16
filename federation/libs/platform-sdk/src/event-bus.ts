import type { Unsubscribe } from './types';

type Handler = (payload: unknown) => void;

/**
 * Minimal pub/sub with "sticky" delivery: the last payload of each event is replayed to new
 * subscribers, so an app mounted after the publisher was unmounted still gets the latest value.
 */
export class EventBus {
  private handlers = new Map<string, Set<Handler>>();
  private last = new Map<string, unknown>();

  publish(event: string, payload: unknown): void {
    this.last.set(event, payload);
    this.handlers.get(event)?.forEach((handler) => handler(payload));
  }

  subscribe(event: string, handler: Handler): Unsubscribe {
    const set = this.handlers.get(event) ?? new Set<Handler>();
    set.add(handler);
    this.handlers.set(event, set);
    if (this.last.has(event)) {
      handler(this.last.get(event));
    }
    return () => set.delete(handler);
  }
}
