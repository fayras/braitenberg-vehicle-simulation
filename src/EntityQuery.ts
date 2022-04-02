import { Entity } from './Entity';
import { ComponentType } from './enums';

export class EntityQuery {
  private mEntities: Set<Entity> = new Set();

  public types: readonly ComponentType[];

  private onAddedHandlers: Set<(entity: Entity) => void> = new Set();

  private onRemovedHandlers: Set<(entity: Entity) => void> = new Set();

  constructor(types: ComponentType[]) {
    this.types = types;
  }

  public static getKey(types: readonly ComponentType[]): ComponentType {
    // eslint-disable-next-line no-bitwise
    return types.reduce((a, b) => a | b);
  }

  get key(): ComponentType {
    return EntityQuery.getKey(this.types);
  }

  get entities(): ReadonlySet<Entity> {
    return this.mEntities;
  }

  public add(entity: Entity): void {
    this.mEntities.add(entity);
    this.onAddedHandlers.forEach((handler) => handler(entity));
  }

  public remove(entity: Entity): void {
    this.mEntities.delete(entity);
    this.onRemovedHandlers.forEach((handler) => handler(entity));
  }

  public has(entity: Entity): boolean {
    return this.mEntities.has(entity);
  }

  public onEnter(callback: (entity: Entity) => void): IDisposable {
    this.onAddedHandlers.add(callback);
    return () => this.onAddedHandlers.delete(callback);
  }

  public onExit(callback: (entity: Entity) => void): IDisposable {
    this.onRemovedHandlers.add(callback);
    return () => this.onRemovedHandlers.delete(callback);
  }
}
