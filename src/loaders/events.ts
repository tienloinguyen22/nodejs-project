import events from 'events';
import { EventNames } from '../core';
import { authTest } from '../subscribers';

export const eventSubscribersLoader = (eventEmitter: events.EventEmitter): void => {
  eventEmitter.on(EventNames.TEST, authTest);
};
