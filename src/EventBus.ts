import { EventType } from './enums';

interface EventHandlerDictionary {
  [index: string]: EventHandler[];
}

class EventBus {
  private handlers: EventHandlerDictionary = {};

  public publish(event: EventType, payload: EventMessage): void {
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

export default new EventBus();
