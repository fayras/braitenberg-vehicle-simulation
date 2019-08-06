import Entity from './Entity';
import EventBus from './EventBus';

import Component from './components/Component';
import { EventType, ComponentType } from './enums';
import MotorComponent from './components/MotorComponent';
import SolidBodyComponent from './components/SolidBodyComponent';
import TransformableComponent from './components/TransformableComponent';
import RenderComponent from './components/RenderComponent';
import SensorComponent from './components/SensorComponent';

import ConnectionComponent from './components/ConnectionComponent';
import SourceComponent from './components/SourceComponent';

class EntityManager {
  private entities: { [id: number]: Entity } = {};

  // fügt eine neue, bereits erstellte Entität dem EntityManger hinzu
  public addExistingEntity(entity: Entity): void {
    this.entities[entity.id] = entity;
    EventBus.publish(EventType.ENTITY_CREATED, entity);
  }

  // fügt eine neue, noch nicht erstelle Entität mit den übergebenen Komponenten hinzu
  public createEntity(...components: Component[]): Entity {
    const entity = new Entity();
    components.forEach(c => {
      entity.addComponent(c);
    });
    this.entities[entity.id] = entity;
    EventBus.publish(EventType.ENTITY_CREATED, entity);

    return entity;
  }

  // zerstört die Entität mit der übergebenen Id
  public destroyEntity(id: number): void {
    const entity = this.entities[id];

    EventBus.publish(EventType.ENTITY_DESTROYED, entity);
    delete this.entities[id];
  }

  // fügt den übergebenen Komponenten der Entität mit der übergebenen Id hinzu
  // Rückgabe:
  public addComponent(entityId: number, component: Component): Entity | undefined {
    const entity = this.entities[entityId];

    if (!entity) {
      console.warn(`Entität mit ID ${entityId} konnte nicht gefunden werden`);
      return undefined;
    }

    const id = entity.addComponent(component);

    if (id === -1) {
      return undefined;
    }

    EventBus.publish(EventType.ENTITY_COMPONENT_ADDED, { entity, component });

    return entity;
  }

  // löscht den übergebenen Komponenten der Entität mit der übergeben Id
  public removeComponent(entityId: number, component: Component): Entity | undefined {
    const entity = this.entities[entityId];

    if (!entity) {
      console.warn(`Entität mit ID ${entityId} konnte nicht gefunden werden`);
      return;
    }

    entity.removeComponent(component);
    EventBus.publish(EventType.ENTITY_COMPONENT_REMOVED, { entity, component });
  }

  // gibt alle eingefügten Entitäten zurück
  public getEntities(): Entity[] {
    return Object.values(this.entities);
  }

  // lädt aus einem Array alle Entitäten und Komponenten und fügt sie dem EntityManager hinzu
  public loadEntities(allEntities: SerializedEntity[]): void {
    allEntities.forEach(serializedEntity => {
      const entity = new Entity();
      serializedEntity.components.forEach(serializedComponent => {
        const { name, id, attributes } = serializedComponent;
        const component = EntityManager.getComponent(name, attributes);
        if (component) {
          component.id = id;
          entity.addComponent(component);
        }
      });

      this.addExistingEntity(entity);
    });
  }

  private static getComponent(name: ComponentType, attributes: any): Component | undefined {
    switch (name) {
      case ComponentType.TRANSFORMABLE:
        return new TransformableComponent(attributes);
      case ComponentType.SOURCE:
        return new SourceComponent(attributes);
      case ComponentType.SOLID_BODY:
        return new SolidBodyComponent(attributes);
      case ComponentType.RENDER:
        return new RenderComponent(attributes);
      case ComponentType.MOTOR:
        return new MotorComponent(attributes);
      case ComponentType.SENSOR:
        return new SensorComponent(attributes);
      case ComponentType.CONNECTION:
        return new ConnectionComponent(attributes);
      default:
        return undefined;
    }
  }
}

export default new EntityManager();
