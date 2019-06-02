import Entity from './Entity';
import EventBus from './EventBus';
import Component from './components/Component';
import { EventType } from './enums';

export default class EntityManager {
  private entities: { [id: number]: Entity } = {};

  public addExistingEntity(entity: Entity): void {
    this.entities[entity.id] = entity;
    EventBus.publish(EventType.ENTITY_CREATED, entity);
  }

  public createEntity(...components: Component[]): Entity {
    const entity = new Entity();
    components.forEach(c => {
      entity.addComponent(c);
    });
    this.entities[entity.id] = entity;
    EventBus.publish(EventType.ENTITY_CREATED, entity);

    return entity;
  }

  public destroyEntity(id: number): void {
    const entity = this.entities[id];

    EventBus.publish(EventType.ENTITY_DESTROYED, entity);
    delete this.entities[id];
  }

  public getEntities(): Entity[] {
    return Object.values(this.entities);
  }
}
