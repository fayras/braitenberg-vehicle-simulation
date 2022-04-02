import { Entity } from '../Entity';
import EntityManager from '../EntityManager';
import { ComponentType } from '../enums';
import { EntityQuery } from '../EntityQuery';

export abstract class System {
  protected scene: Phaser.Scene;

  protected expectedComponents: ComponentType[];

  protected canBePaused: boolean;

  protected query: EntityQuery;

  protected isPaused = false;

  protected constructor(scene: Phaser.Scene, expectedComponents: ComponentType[], canBePaused = true) {
    this.scene = scene;
    this.expectedComponents = expectedComponents;
    this.canBePaused = canBePaused;

    this.query = EntityManager.createQuery(this.expectedComponents);
    this.query.onEnter((entity) => this.enter(entity));
    this.query.onExit((entity) => this.exit(entity));
  }

  public pause(flag: boolean): void {
    this.isPaused = flag;
  }

  public update(delta: number): void {
    if (this.canBePaused && this.isPaused) return;

    this.internalUpdate(this.query.entities, delta);
  }

  protected abstract internalUpdate(entities: ReadonlySet<Entity>, delta: number): void;

  protected enter(entity: Entity): void {}

  protected exit(entity: Entity): void {}
}
