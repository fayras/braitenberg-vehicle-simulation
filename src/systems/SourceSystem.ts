import Phaser from 'phaser';
import Entity from '../Entity';
import { ComponentType } from '../enums';
import System from './System';
import TransformableComponent from '../components/TransformableComponent';
import SourceComponent from '../components/SourceComponent';

export default class SourceSystem extends System {
  public expectedComponents: ComponentType[] = [ComponentType.SOURCE, ComponentType.TRANSFORMABLE];

  private physicsObjects: { [componentId: number]: Phaser.Physics.Matter.Matter.Body } = {};

  public update(entities: Entity[]): void {
    entities.forEach(entity => {
      const source = entity.getComponent(ComponentType.SOURCE) as SourceComponent;
      if (!this.physicsObjects[source.id]) this.addSensorObject(entity, source);
    });
  }

  private addSensorObject(entity: Entity, source: SourceComponent): Phaser.Physics.Matter.Matter.Body {
    const body = Phaser.Physics.Matter.Matter.Bodies.circle(0, 0, source.range / 2, {
      isSensor: true,
    });

    this.attachSynchronization(body, entity);

    body.label = ComponentType.SOURCE;
    body.userData = {
      belongsTo: {
        entity: entity.id,
      },
    };
    this.scene.matter.world.add(body);
    this.physicsObjects[source.id] = body;

    return body;
  }

  private attachSynchronization(body: Phaser.Physics.Matter.Matter.Body, entity: Entity): void {
    const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
    this.scene.matter.world.on('beforeupdate', () => {
      Phaser.Physics.Matter.Matter.Body.setPosition(body, {
        x: transform.position.x,
        y: transform.position.y,
      });
    });
  }
}
