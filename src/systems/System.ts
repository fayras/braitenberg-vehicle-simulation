import { ComponentType } from '../enums';
import EventBus from '../EventBus';
import Entity from '../Entity';

export default abstract class System {
  public expectedComponents: ComponentType[] = [];

  protected scene: Phaser.Scene;

  protected eventBus: EventBus;

  public constructor(scene: Phaser.Scene, bus: EventBus) {
    this.scene = scene;
    this.eventBus = bus;
  }

  public abstract update(entities: Entity[], delta: number): void;
}
