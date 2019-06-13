import Phaser from 'phaser';
import Entity from './Entity';
import EventBus from './EventBus';

import tankImg from '../assets/tank.png';
import logoImg from '../assets/logo.png';
import sourceImg from '../assets/source.png';

import Component from './components/Component';
import { EventType } from './enums';
import MotorComponent from './components/MotorComponent';
import SolidBodyComponent from './components/SolidBodyComponent';
import TransformableComponent from './components/TransformableComponent';
import RenderComponent from './components/RenderComponent';
import SensorComponent from './components/SensorComponent';
import { Render } from 'matter-js';
import ConnectionComponent from './components/ConnectionComponent';
import SourceComponent from './components/SourceComponent';

class EntityManager {
  private entities: { [id: number]: Entity } = {};

  load.image('logo', logoImg);
  load.image('source', sourceImg);
  load.image('tank', tankImg);

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

  public loadEntities(allEntities: SerializedEntity[]): void {
    allEntities.forEach(serializedEntity => {
      const entity = new Entity();
      serializedEntity.components.forEach(serializedComponent => {
        const { name, id } = serializedComponent;
        if (name === 'TRANSFORMABLE') {
          const component = new TransformableComponent(serializedComponent.attributes.position);
          component.id = id;
          entity.addComponent(component);
        }
        if (name === 'SOURCE') {
          const component = new SourceComponent(
            serializedComponent.attributes.range,
            serializedComponent.attributes.substance,
          );
          component.id = id;
          entity.addComponent(component);
        }
        if (name === 'BODY') {
          const component = new SolidBodyComponent(
            serializedComponent.attributes.size,
            serializedComponent.attributes.shape,
          );
          component.id = id;
          entity.addComponent(component);
        }
        if (name === 'RENDER') {
          const component = new RenderComponent(
            serializedComponent.attributes.asset,
            serializedComponent.attributes.width,
            serializedComponent.attributes.blendMode,
          );
          component.id = id;
          entity.addComponent(component);
        }
        if (name === 'MOTOR') {
          const component = new MotorComponent(
            serializedComponent.attributes.position,
            serializedComponent.attributes.maxSpeed,
            serializedComponent.attributes.defaultSpeed,
          );
          component.id = id;
          entity.addComponent(component);
        }
        if (name === 'SENSOR') {
          const component = new SensorComponent(
            serializedComponent.attributes.position,
            serializedComponent.attributes.range,
            serializedComponent.attributes.angle,
            serializedComponent.attributes.reactsTo,
          );
          component.id = id;
          entity.addComponent(component);
        }
        if (name === 'CONNECTION') {
          const component = new ConnectionComponent(
            serializedComponent.attributes.inputIds,
            serializedComponent.attributes.outputIds,
            serializedComponent.attributes.weights,
          );
          component.id = id;
          entity.addComponent(component);
        }

        console.log(serializedComponent);
      });

      this.addExistingEntity(entity);
    });
  }
}

export default new EntityManager();
