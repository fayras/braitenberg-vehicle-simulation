import { ComponentType, EventType } from '../enums';
import EventBus from '../EventBus';
import Entity from '../Entity';
import Component from '../components/Component';

export default abstract class System {
  public expectedComponents: ComponentType[] = [];

  protected entities: Entity[] = [];

  protected scene: Phaser.Scene;

  public constructor(scene: Phaser.Scene) {
    this.scene = scene;
    EventBus.subscribe(EventType.ENTITY_CREATED, (entity: Entity) => {
      if (entity.hasComponents(...this.expectedComponents)) {
        this.onEntityCreated(entity);
        this.entities.push(entity);
      }
    });

    EventBus.subscribe(EventType.ENTITY_DESTROYED, (entity: Entity) => {
      if (entity.hasComponents(...this.expectedComponents)) {
        this.onEntityDestroyed(entity);

        const found = this.entities.findIndex(e => e.id === entity.id);
        if (found > -1) {
          this.entities.splice(found, 1);
        }
      }
    });

    EventBus.subscribe(EventType.ENTITY_COMPONENT_ADDED, (payload: any) => {
      const entity = payload.entity as Entity;
      const component = payload.component as Component;

      if (!entity.hasComponents(...this.expectedComponents)) return;

      const exists = this.entities.includes(entity);
      if (!exists) {
        this.entities.push(entity);
      }

      this.onEntityComponentAdded(entity, component);
    });

    EventBus.subscribe(EventType.ENTITY_COMPONENT_REMOVED, (payload: any) => {
      const entity = payload.entity as Entity;
      const component = payload.component as Component;

      const hasComponents = entity.hasComponents(...this.expectedComponents);

      this.onEntityComponentRemoved(entity, component);

      if (!hasComponents) {
        const found = this.entities.findIndex(e => e.id === entity.id);
        if (found > -1) {
          this.entities.splice(found, 1);
        }
      }
    });
  }

  public abstract update(delta: number): void;

  protected onEntityCreated(entity: Entity): void {}

  protected onEntityDestroyed(entity: Entity): void {}

  protected onEntityComponentAdded(entity: Entity, component: Component): void {}

  protected onEntityComponentRemoved(entity: Entity, component: Component): void {}
}
