import { createEvent, createStore } from 'effector';
import Entity from '../../Entity';

export const select = createEvent<Entity | null>();

export const selectedEntity = createStore<Entity | null>(null).on(select, (_, payload) => payload);
export const components = selectedEntity.map((entity) => entity?.getAllComponents());
