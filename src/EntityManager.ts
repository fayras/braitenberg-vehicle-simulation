import Phaser from 'phaser';
import Entity from './Entity';
import EventBus from './EventBus';

import Component from './components/Component';
import { EventType } from './enums';
import MotorComponent from './components/MotorComponent';
import SolidBodyComponent from './components/SolidBodyComponent';
import TransformableComponent from './components/TransformableComponent';
import RenderComponent from './components/RenderComponent';

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
        if (name === 'BODY') {
          const component = new SolidBodyComponent(
            serializedComponent.attributes.size,
            serializedComponent.attributes.shape,
          );
          component.id = id;
          entity.addComponent(component);
        }
        if (name === 'RENDER') {
          //component.id = id;
        }
        if (name === 'MOTOR') {
          const component = new MotorComponent(
            serializedComponent.attributes.position,
            serializedComponent.attributes.maxSpeed,
            serializedComponent.attributes.defaultSpeed,
          );
          component.id = id;
          console.log('Ich bin ein Motor');
          entity.addComponent(component);
        }
        if (name === 'SENSOR') {
          //component.id = id;
        }
        if (name === 'CONNECTION') {
          // component.id = id;
        }

        console.log(serializedComponent);
      });

      this.addExistingEntity(entity);
      // this.addExistingEntity(render);
    });

    // Name aus JSON bekommen um component mit Name zu bekommen.
    // name = componet type, Name im Construktor verwenden
    //   //this.entities[entity.id] = entity;
    //   EventBus.publish(EventType.ENTITY_CREATED, entity);
    //   //addcomponent gibt id zurück
  }
}

export default new EntityManager();
