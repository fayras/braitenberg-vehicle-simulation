import Component from '../components/Component';
import { Entity } from '../Entity';
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
    this.query.onEnter((entity) => this.enter(entity));
    this.query.onExit((entity) => this.exit(entity));
    this.query.onChange((entity, added, removed) => this.change(entity, added, removed));
  }

  public pause(flag: boolean): void {
    this.isPaused = flag;
  }

  public update(delta: number): void {
    if (this.canBePaused && this.isPaused) return;

    this.internalUpdate(this.query.entities, delta);
  }

  protected abstract internalUpdate(entities: ReadonlySet<Entity>, delta: number): void;

  protected enter(entity: Entity): void {
    console.log('System enter');
  }
  protected exit(entity: Entity): void {
    console.log('System exit');
  }
  protected change(entity: Entity, added?: Component, removed?: Component): void {
    console.log('System change');
  }
}
