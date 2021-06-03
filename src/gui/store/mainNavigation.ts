import { createEvent, createStore } from 'effector';

export const togglePlay = createEvent();
export const setPlay = createEvent<boolean>();
export const reset = createEvent();
export const saveSnapshop = createEvent();
export const importData = createEvent();
export const exportData = createEvent();

export const playState = createStore<boolean>(false)
  .on(togglePlay, (play) => !play)
  .on(setPlay, (_, flag) => flag);

// export const snapshot = createStore<boolean>(false)
//   .on(togglePlay, (play) => !play)
//   .on(setPlay, (_, flag) => flag);
