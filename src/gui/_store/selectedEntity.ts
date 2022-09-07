import { makeAutoObservable } from 'mobx';
import { Entity } from '../../Entity';
import { ECSComponent } from '../../components/ECSComponent';
import { NameComponent } from '../../components/NameComponent';
import { ComponentType } from '../../enums';

class SelectedEntityStore {
  selectedEntity: Entity | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get components(): ECSComponent[] {
    if (this.selectedEntity === null) {
      return [];
    }

    return this.selectedEntity.getAllComponents();
  }

  get name(): string | undefined {
    if (this.selectedEntity === null) {
      return undefined;
    }

    return this.selectedEntity.getComponent<NameComponent>(ComponentType.NAME)?.name.value;
  }

  get children(): Entity[] | undefined {
    if (this.selectedEntity === null) {
      return undefined;
    }

    return [...this.selectedEntity.children];
  }

  get isSelected(): boolean {
    return this.selectedEntity !== null;
  }

  select(entity: Entity | null): void {
    this.selectedEntity = entity;
  }
}

export const store = new SelectedEntityStore();
