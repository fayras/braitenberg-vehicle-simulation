import { createEvent, createStore } from 'effector';

export const toggle = createEvent<void>();
export const open = createEvent<void>();
export const close = createEvent<void>();

export const isOpen = createStore<boolean>(false)
  .on(toggle, (state) => !state)
  .on(open, (state) => true)
  .on(close, (state) => false);
