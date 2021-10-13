import { makeAutoObservable } from 'mobx';
import Entity from '../../Entity';

class SelectedEntityStore {
  selectedEntity: Entity | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get components() {
    if (this.selectedEntity === null) {
      return [];
    }

    return this.selectedEntity.getAllComponents();
  }

  get isSelected() {
    return this.selectedEntity !== null;
  }

  select(entity: Entity | null) {
    this.selectedEntity = entity;
  }
}

export const store = new SelectedEntityStore();
