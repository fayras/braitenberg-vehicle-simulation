import Entity from '../Entity';
import EntityManager, { EntityQuery } from '../EntityManager';
import { ComponentType } from '../enums';

export default abstract class System {
  protected scene: Phaser.Scene;
  protected expectedComponents: ComponentType[];
  protected canBePaused: boolean;
  protected query: EntityQuery;
  protected isPaused: boolean = false;

  public constructor(scene: Phaser.Scene, expectedComponents: ComponentType[], canBePaused: boolean = true) {
    this.scene = scene;
    this.expectedComponents = expectedComponents;
    this.canBePaused = canBePaused;

    this.query = EntityManager.createQuery(this.expectedComponents);
    // query.onEntityAdded((entity) => this.createPhysicsObject(entity))
  }

  public pause(flag: boolean): void {
    this.isPaused = flag;
  }

  public update(delta: number): void {
    if (this.canBePaused && this.isPaused) return;

    this.internalUpdate(this.query.entities, delta);
  }

  protected abstract internalUpdate(entities: ReadonlySet<Entity>, delta: number): void;
}
