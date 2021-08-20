import { createEvent, createStore } from 'effector';
import Entity from '../../Entity';

type EmptyOrNull = null | Entity;

export const select = createEvent<EmptyOrNull>();

// export const drawerVisible = createStore<boolean>(false).on(toggle, (play) => !play);

export const selectedEntity = createStore<EmptyOrNull>(null).on(select, (_, payload) => payload);

// export const snapshot = createStore<boolean>(false)
//   .on(togglePlay, (play) => !play)
//   .on(setPlay, (_, flag) => flag);
