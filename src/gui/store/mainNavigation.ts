import { createEvent, createStore } from 'effector';

export const togglePlay = createEvent();
export const setPlay = createEvent<boolean>();
export const reset = createEvent();

export const playState = createStore<boolean>(false)
  .on(togglePlay, (play) => !play)
  .on(setPlay, (_, flag) => flag);
