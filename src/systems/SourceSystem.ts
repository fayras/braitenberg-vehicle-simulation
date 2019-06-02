import Phaser from 'phaser';
import Entity from '../Entity';
import { ComponentType } from '../enums';
import System from './System';
import TransformableComponent from '../components/TransformableComponent';
import SourceComponent from '../components/SourceComponent';
import { gaussian } from '../utils/reactions';

export default class SourceSystem extends System {
  public expectedComponents: ComponentType[] = [ComponentType.SOURCE, ComponentType.TRANSFORMABLE];

  private physicsObjects: {
    [componentId: number]: {
      body: SourcePhysicsObject;
      eventBeforeUpdate: Function;
    };
  } = {};

  public update(): void {}

  protected onEntityCreated(entity: Entity): void {
    const source = entity.getComponent(ComponentType.SOURCE) as SourceComponent;
    this.addSensorObject(entity, source);
  }

  protected onEntityDestroyed(entity: Entity): void {
    const sources = entity.getMultipleComponents(ComponentType.SOURCE) as SourceComponent[];
    sources.forEach(source => {
      const { body, eventBeforeUpdate } = this.physicsObjects[source.id];

      this.scene.matter.world.off('beforeupdate', eventBeforeUpdate);
      this.scene.matter.world.remove(body, false);
      delete this.physicsObjects[entity.id];
    });
  }

  private addSensorObject(entity: Entity, source: SourceComponent): SourcePhysicsObject {
    const body = Phaser.Physics.Matter.Matter.Bodies.circle(0, 0, source.range / 2, {
      isSensor: true,
    }) as SourcePhysicsObject;

    const emitter = this.attachSynchronization(body, entity);

    body.label = ComponentType.SOURCE;
    body.userData = {
      kernel: gaussian({ x: 0, y: 0 }, { x: source.range, y: source.range }),
      belongsTo: {
        entity,
        component: source,
      },
    };
    this.scene.matter.world.add(body);
    this.physicsObjects[source.id] = {
      body,
      eventBeforeUpdate: emitter,
    };

    return body;
  }

  private attachSynchronization(body: Phaser.Physics.Matter.Matter.Body, entity: Entity): Function {
    const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
    const onBefore = (): void => {
      Phaser.Physics.Matter.Matter.Body.setPosition(body, {
        x: transform.position.x,
        y: transform.position.y,
      });
    };
    this.scene.matter.world.on('beforeupdate', onBefore);

    return onBefore;
  }
}
