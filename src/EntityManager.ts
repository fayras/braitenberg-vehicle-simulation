import Phaser from 'phaser';
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

  public addComponent(entityId: number, component: Component): Entity | undefined {
    const entity = this.entities[entityId];

    if (!entity) {
      console.warn(`Entität mit ID ${entityId} konnte nicht gefunden werden`);
      return;
    }

    entity.addComponent(component);
    EventBus.publish(EventType.ENTITY_COMPONENT_ADDED, { entity, component });
  }

  public removeComponent(entityId: number, component: Component): Entity | undefined {
    const entity = this.entities[entityId];

    if (!entity) {
      console.warn(`Entität mit ID ${entityId} konnte nicht gefunden werden`);
      return;
    }

    entity.removeComponent(component);
    EventBus.publish(EventType.ENTITY_COMPONENT_REMOVED, { entity, component });
  }

  public getEntities(): Entity[] {
    return Object.values(this.entities);
  }

  public loadEntities(allEntities: SerializedEntity[]): void {
    allEntities.forEach(serializedEntity => {
      const entity = new Entity();
      serializedEntity.components.forEach(serializedComponent => {
        const { name, id } = serializedComponent;
        if (name === ComponentType.TRANSFORMABLE) {
          const component = new TransformableComponent(serializedComponent.attributes.position);
          component.id = id;
          entity.addComponent(component);
        }
        if (name === ComponentType.SOURCE) {
          const component = new SourceComponent(
            serializedComponent.attributes.range,
            serializedComponent.attributes.substance,
          );
          component.id = id;
          entity.addComponent(component);
        }
        if (name === ComponentType.SOLID_BODY) {
          const component = new SolidBodyComponent(
            serializedComponent.attributes.size,
            serializedComponent.attributes.shape,
          );
          component.id = id;
          entity.addComponent(component);
        }
        if (name === ComponentType.RENDER) {
          const component = new RenderComponent(
            serializedComponent.attributes.asset,
            serializedComponent.attributes.size,
            serializedComponent.attributes.blendMode,
          );
          component.id = id;
          entity.addComponent(component);
        }
        if (name === ComponentType.MOTOR) {
          const component = new MotorComponent(
            serializedComponent.attributes.position,
            serializedComponent.attributes.maxSpeed,
            serializedComponent.attributes.defaultSpeed,
          );
          component.id = id;
          entity.addComponent(component);
        }
        if (name === ComponentType.SENSOR) {
          const component = new SensorComponent(
            serializedComponent.attributes.position,
            serializedComponent.attributes.range,
            serializedComponent.attributes.angle,
            serializedComponent.attributes.reactsTo,
          );
          component.id = id;
          entity.addComponent(component);
        }
        if (name === ComponentType.CONNECTION) {
          const component = new ConnectionComponent(
            serializedComponent.attributes.inputIds,
            serializedComponent.attributes.outputIds,
            serializedComponent.attributes.weights,
          );
          component.id = id;
          entity.addComponent(component);
        }
      });

      this.addExistingEntity(entity);
    });
  }
}

export default new EntityManager();
