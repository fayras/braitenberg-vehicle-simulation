import Phaser from 'phaser';
import * as tf from '@tensorflow/tfjs-core';
import Entity from '../Entity';
import { ComponentType, EmissionType, CORRELATION_SCALE } from '../enums';
import System from './System';
import TransformableComponent from '../components/TransformableComponent';
import SourceComponent from '../components/SourceComponent';
import { gaussian, flat } from '../utils/reactions';

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
    this.addSourceObject(entity, source);
  }

  protected onEntityDestroyed(entity: Entity): void {
    const sources = entity.getMultipleComponents(ComponentType.SOURCE) as SourceComponent[];
    sources.forEach(source => {
      const { body, eventBeforeUpdate } = this.physicsObjects[source.id];

      this.scene.matter.world.off('beforeupdate', eventBeforeUpdate);
      this.scene.matter.world.remove(body, false);
      body.userData.tensor.dispose();

      delete this.physicsObjects[entity.id];
    });
  }

  private addSourceObject(entity: Entity, source: SourceComponent): SourcePhysicsObject {
    const body = Phaser.Physics.Matter.Matter.Bodies.circle(0, 0, source.range * 3, {
      isSensor: true,
    }) as SourcePhysicsObject;

    const emitter = this.attachSynchronization(body, entity);
    const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;

    // const { width, height } = this.scene.cameras.main;
    const width = Math.ceil(this.scene.cameras.main.width / CORRELATION_SCALE);
    const height = Math.ceil(this.scene.cameras.main.height / CORRELATION_SCALE);

    const offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = width;
    offScreenCanvas.height = height;
    const context = offScreenCanvas.getContext('2d') as CanvasRenderingContext2D;

    // Das Ganze ggf in einem/mehreren Worker Thread(s) machen?
    const values = new Float32Array(width * height);
    let f;
    if (source.emissionType === EmissionType.GAUSSIAN) {
      f = gaussian(transform.position, { x: source.range, y: source.range });
    } else {
      f = flat();
    }

    let max = 0;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        let v = f(x * CORRELATION_SCALE, y * CORRELATION_SCALE);
        values[y * width + x] = v;

        if (v > max) max = v;

        v = Math.round(v * 255);
        context.fillStyle = `rgb(${v}, ${v}, ${v})`;
        context.fillRect(x, y, 1, 1);
      }
    }

    console.log(max);

    window.open(offScreenCanvas.toDataURL(), '_blank');

    const input = tf.tensor3d(values, [height, width, 1]);
    window.tf = tf;

    body.label = ComponentType.SOURCE;
    body.userData = {
      kernel: f,
      tensor: input,
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
