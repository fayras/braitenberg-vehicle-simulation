import Phaser from 'phaser';
import * as tf from '@tensorflow/tfjs-core';
import Entity from '../Entity';
import { ComponentType, EmissionType, EventType, SubstanceType } from '../enums';
import { CORRELATION_SCALE } from '../constants';
import System from './System';
import TransformableComponent from '../components/TransformableComponent';
import SourceComponent from '../components/SourceComponent';
import { gaussian, flatRect } from '../utils/reactions';
import SolidBodyComponent from '../components/SolidBodyComponent';
import { getCanvas, getContext } from '../utils/canvas';
import EventBus from '../EventBus';

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

      delete this.physicsObjects[entity.id];
    });
  }

  private addSourceObject(entity: Entity, source: SourceComponent): SourcePhysicsObject {
    const isGaussian = source.emissionType.get() === EmissionType.GAUSSIAN;
    const solidBody = entity.getComponent(ComponentType.SOLID_BODY) as SolidBodyComponent | undefined;

    const body = isGaussian
      ? SourceSystem.createCircleShape(source.range.get() * 3)
      : SourceSystem.createRectShape(solidBody, source.range.get());

    const emitter = this.attachSynchronization(body, entity);
    const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;

    // const { width, height } = this.scene.cameras.main;
    const width = Math.ceil(this.scene.cameras.main.width / CORRELATION_SCALE);
    const height = Math.ceil(this.scene.cameras.main.height / CORRELATION_SCALE);

    // const offScreenCanvas = getCanvas(width, height);
    // const context = getContext(offScreenCanvas);
    const texture = this.scene.textures.createCanvas(`source_texture_${source.id}`, width, height);
    const context = texture.getContext();

    // Das Ganze ggf in einem/mehreren Worker Thread(s) machen?
    const values = new Float32Array(width * height);
    const f = isGaussian
      ? gaussian(transform.position.get(), { x: source.range.get(), y: source.range.get() })
      : flatRect(
          Phaser.Physics.Matter.Matter.Vector.sub(transform.position.get(), {
            x: (solidBody ? solidBody.size.get().width : source.range.get()) / 2,
            y: (solidBody ? solidBody.size.get().height : source.range.get()) / 2,
          }),
          solidBody ? solidBody.size.get().width : source.range.get(),
          solidBody ? solidBody.size.get().height : source.range.get(),
        );

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        let v = f(x * CORRELATION_SCALE, y * CORRELATION_SCALE);
        values[y * width + x] = v;

        if (source.substance.get() === SubstanceType.BARRIER) {
          v = Math.round(v * 255);
          context.fillStyle = `rgb(${0}, ${0}, ${v})`;
          context.fillRect(x, y, 1, 1);
        } else if (source.substance.get() === SubstanceType.LIGHT) {
          v = Math.round(v * 255);
          context.fillStyle = `rgb(${v}, ${v}, ${0})`;
          context.fillRect(x, y, 1, 1);
        }
      }
    }

    texture.refresh();
    const image = this.scene.add.image(0, 0, `source_texture_${source.id}`);
    image.setOrigin(0);
    image.setScale(CORRELATION_SCALE);
    image.setBlendMode(Phaser.BlendModes.SCREEN);
    this.scene.children.bringToTop(image);

    // window.open(offScreenCanvas.toDataURL(), '_blank');

    EventBus.publish(EventType.SOURCE_CREATED, {
      id: source.id,
      values,
      width,
      height,
    });

    body.label = ComponentType.SOURCE;
    body.userData = {
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

  private static createRectShape(solidBody: SolidBodyComponent | undefined, range: number): SourcePhysicsObject {
    if (solidBody === undefined) {
      return Phaser.Physics.Matter.Matter.Bodies.rectangle(0, 0, range, range, {
        isSensor: true,
      }) as SourcePhysicsObject;
    }

    return Phaser.Physics.Matter.Matter.Bodies.rectangle(
      0,
      0,
      solidBody.size.get().width + 20,
      solidBody.size.get().height + 20,
      {
        isSensor: true,
      },
    ) as SourcePhysicsObject;
  }

  private static createCircleShape(range: number): SourcePhysicsObject {
    return Phaser.Physics.Matter.Matter.Bodies.circle(0, 0, range, {
      isSensor: true,
    }) as SourcePhysicsObject;
  }

  private attachSynchronization(body: Phaser.Physics.Matter.Matter.Body, entity: Entity): Function {
    const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
    const onBefore = (): void => {
      Phaser.Physics.Matter.Matter.Body.setPosition(body, {
        x: transform.position.get().x,
        y: transform.position.get().y,
      });
    };
    this.scene.matter.world.on('beforeupdate', onBefore);

    return onBefore;
  }
}
