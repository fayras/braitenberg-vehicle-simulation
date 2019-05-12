import { EventType } from './enums';

type EventHandler = (event: unknown) => void;

interface EventHandlerDictionary {
  [index: string]: EventHandler[];
}

export default class EventBus {
  private handlers: EventHandlerDictionary = {};

  public publish(event: EventType, payload: unknown): void {
    if (!this.handlers[event]) return;

    this.handlers[event].forEach(handler => {
      handler(payload);
    });
  }

  public subscribe(event: EventType, handler: EventHandler): void {
    if (!this.handlers[event]) this.handlers[event] = [];

    this.handlers[event].push(handler);
  }
}
