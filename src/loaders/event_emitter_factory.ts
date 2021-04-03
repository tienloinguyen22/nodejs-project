import events from 'events';

let eventEmitter: events.EventEmitter | undefined;

export const eventEmitterFactory = (): events.EventEmitter => {
  if (!eventEmitter) {
    eventEmitter = new events.EventEmitter();
  }
  return eventEmitter;
};
