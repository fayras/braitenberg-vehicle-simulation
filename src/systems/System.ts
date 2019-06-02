import { ComponentType, EventType } from '../enums';
import EventBus from '../EventBus';
import Entity from '../Entity';

export default abstract class System {
  public expectedComponents: ComponentType[] = [];

  protected entities: Entity[] = [];

  protected scene: Phaser.Scene;

  public constructor(scene: Phaser.Scene) {
    this.scene = scene;
    EventBus.subscribe(EventType.ENTITY_CREATED, (entity: Entity) => {
      if (entity.hasComponents(...this.expectedComponents)) {
        this.onEntityCreated(entity);
      }
    });

    EventBus.subscribe(EventType.ENTITY_DESTROYED, (entity: Entity) => {
      if (entity.hasComponents(...this.expectedComponents)) {
        this.onEntityDestroyed(entity);
      }
    });
  }

  public abstract update(delta: number): void;

  protected abstract onEntityCreated(entity: Entity): void;

  protected abstract onEntityDestroyed(entity: Entity): void;
}
