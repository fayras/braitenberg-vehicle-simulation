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
  }

  public abstract update(delta: number): void;

  protected onEntityCreated(entity: Entity): void {}

  protected onEntityDestroyed(entity: Entity): void {}
}
