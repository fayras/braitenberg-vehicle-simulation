import Phaser from 'phaser';
import * as tf from '@tensorflow/tfjs-core';
import Entity from '../Entity';
import { ComponentType, EventType, CORRELATION_SCALE } from '../enums';
import SensorComponent from '../components/SensorComponent';
import TransformableComponent from '../components/TransformableComponent';
import System from './System';
import EventBus from '../EventBus';
import { gaussian } from '../utils/reactions';

export default class SensorSystem extends System {
  public expectedComponents: ComponentType[] = [ComponentType.SENSOR, ComponentType.TRANSFORMABLE];

  private physicsObjects: {
    [componentId: number]: {
      body: SensorPhysicsObject;
      eventBeforeUpdate: Function;
    };
  } = {};

  public constructor(scene: Phaser.Scene) {
    super(scene);
    // this.scene.matter.world.on('collisionstart', SensorSystem.onCollision);
    this.scene.matter.world.on('collisionactive', SensorSystem.onCollision);
    this.scene.matter.world.on('collisionend', SensorSystem.onCollisionEnd);
  }

  public update(): void {}

  protected onEntityCreated(entity: Entity): void {
    const sensors = entity.getMultipleComponents(ComponentType.SENSOR) as SensorComponent[];
    sensors.forEach(sensor => {
      this.addSensorObject(entity, sensor);
    });
    this.entities.push(entity);
  }

  protected onEntityDestroyed(entity: Entity): void {
    const sensors = entity.getMultipleComponents(ComponentType.SENSOR) as SensorComponent[];
    sensors.forEach(sensor => {
      const { body, eventBeforeUpdate } = this.physicsObjects[sensor.id];

      this.scene.matter.world.off('beforeupdate', eventBeforeUpdate);
      this.scene.matter.world.remove(body, false);
      delete this.physicsObjects[entity.id];
    });
  }

  private addSensorObject(entity: Entity, sensor: SensorComponent): SensorPhysicsObject {
    const body = SensorSystem.createSensor(sensor) as SensorPhysicsObject;
    const emitter = this.attachSynchronization(body, entity, sensor);

    const halfWidth = Math.ceil((sensor.range.get() * 2) / CORRELATION_SCALE);
    const halfHeight = Math.ceil((sensor.range.get() * 2) / CORRELATION_SCALE);
    const width = halfWidth * 2;
    const height = halfHeight * 2;

    const offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = width;
    offScreenCanvas.height = height;
    const context = offScreenCanvas.getContext('2d') as CanvasRenderingContext2D;

    const offScreenCanvasDown = document.createElement('canvas');
    offScreenCanvasDown.width = width;
    offScreenCanvasDown.height = height;
    const contextDown = offScreenCanvasDown.getContext('2d') as CanvasRenderingContext2D;

    const valuesUp = new Float32Array(width * height);
    const valuesRight = new Float32Array(width * height);
    const valuesDown = new Float32Array(width * height);
    const valuesLeft = new Float32Array(width * height);
    const gauss = gaussian({ x: 0, y: 0 }, { x: sensor.angle.get(), y: sensor.range.get() });
    const f = (x: number, y: number, rotation: number = 0): number => {
      // `atan2` ist für x = 0 und y = 0 nicht definiert.
      if (x === 0 && y === 0) return 1;

      const r = Math.sqrt(x ** 2 + y ** 2);
      const phi = Math.atan2(x, y);
      return gauss(phi + rotation, r);
    };

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        let vUp = f((x - halfWidth) * CORRELATION_SCALE, (y - halfHeight) * CORRELATION_SCALE);
        let vRight = f((x - halfWidth) * CORRELATION_SCALE, (y - halfHeight) * CORRELATION_SCALE, Math.PI / 2);

        // x und y werden hier vertauscht, was einer Spiegelung gleichkommt.
        // Weil wir später die Cross-Correlation und nicht die Convolution
        // berechnen wollen.
        const mirrorX = width - x - 1;
        const mirrorY = height - y - 1;

        valuesUp[y * width + x] = vUp;
        valuesRight[y * width + x] = vRight;
        valuesDown[mirrorY * width + mirrorX] = vUp;
        valuesLeft[mirrorY * width + mirrorX] = vRight;

        vUp = Math.round(vUp * 255);
        context.fillStyle = `rgb(${vUp}, ${vUp}, ${vUp})`;
        context.fillRect(x, y, 1, 1);
        vRight = Math.round(vRight * 255);
        contextDown.fillStyle = `rgb(${vRight}, ${vRight}, ${vRight})`;
        contextDown.fillRect(x, y, 1, 1);
      }
    }

    // window.open(offScreenCanvas.toDataURL(), '_blank');
    // window.open(offScreenCanvasDown.toDataURL(), '_blank');

    const up = tf.tensor4d(valuesUp, [height, width, 1, 1]);
    const right = tf.tensor4d(valuesRight, [height, width, 1, 1]);
    const down = tf.tensor4d(valuesDown, [height, width, 1, 1]);
    const left = tf.tensor4d(valuesLeft, [height, width, 1, 1]);

    body.label = ComponentType.SENSOR;
    body.userData = {
      kernel: f,
      tensors: [
        {
          angle: 0,
          tensor: up,
        },
        {
          angle: Math.PI / 2,
          tensor: right,
        },
        {
          angle: Math.PI,
          tensor: down,
        },
        {
          angle: Math.PI + Math.PI / 2,
          tensor: left,
        },
      ],
      belongsTo: {
        entity,
        // TODO: Hier wird jetzt die Referenz auf die gesamte Komponente gespeichert.
        // Wäre es besser hier nur die ID zu speichern und dann später mittels sowas
        // wie `EntityManager` die Komponente über die ID zu holen?
        component: sensor,
      },
    };
    this.scene.matter.world.add(body);
    this.physicsObjects[sensor.id] = {
      body,
      eventBeforeUpdate: emitter,
    };

    return body;
  }

  private attachSynchronization(
    body: Phaser.Physics.Matter.Matter.Body,
    entity: Entity,
    component: SensorComponent,
  ): Function {
    const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;

    const onBefore = (): void => {
      component.activation.set(0);
      const direction = Phaser.Physics.Matter.Matter.Vector.rotate(component.position.get(), transform.angle.get());
      Phaser.Physics.Matter.Matter.Body.setPosition(body, {
        x: transform.position.get().x + direction.x,
        y: transform.position.get().y + direction.y,
      });
      Phaser.Physics.Matter.Matter.Body.setAngle(body, transform.angle.get());
    };

    // Hier brauchen wir nur `beforeupdate` (Kein `afterupdate`), da die Position und Winkel
    // des Sensors immer relativ zum Objekt selbst sind und somit nicht durch die Physik-
    // Engine beeinflusst werden.
    this.scene.matter.world.on('beforeupdate', onBefore);

    return onBefore;
  }

  private static createSensor(component: SensorComponent): Phaser.Physics.Matter.Matter.Body {
    const width = Math.ceil(component.range.get() * 2);
    const height = Math.ceil(component.range.get() * 2);

    const direction = Phaser.Physics.Matter.Matter.Vector.normalise(component.position.get());
    // const fullVector = Phaser.Physics.Matter.Matter.Vector.mult(direction, component.range);

    const body = Phaser.Physics.Matter.Matter.Bodies.rectangle(0, 0, width, height, {
      isSensor: true,
    });

    // const offset = Phaser.Physics.Matter.Matter.Vertices.centre(body.vertices);

    // Hier muss die Position gesetzt werden, was ein Workaround
    // dafür ist Origin-Punkt des Dreiecks zu setzen.
    // body.positionPrev.x -= height / 2;
    body.positionPrev.y -= height / 2 - 20;
    // body.position.x -= height / 2;
    body.position.y -= height / 2 - 20;

    return body;
  }

  private static getCollisionBodies(pair: Phaser.Physics.Matter.Matter.IPair): CollisionBodies | null {
    // Sensoren können nicht mit anderen Sensoren reagieren.
    if (pair.bodyA.label === ComponentType.SENSOR && pair.bodyB.label === ComponentType.SENSOR) {
      return null;
    }

    if (pair.bodyA.label === ComponentType.SENSOR) {
      return {
        sensor: pair.bodyA as SensorPhysicsObject,
        other: pair.bodyB as ComponentPhysicsBody,
      };
    }

    if (pair.bodyB.label === ComponentType.SENSOR) {
      return {
        sensor: pair.bodyB as SensorPhysicsObject,
        other: pair.bodyA as ComponentPhysicsBody,
      };
    }

    return null;
  }

  public static onCollision(event: Phaser.Physics.Matter.Events.CollisionActiveEvent): void {
    event.pairs.forEach(pair => {
      if (!pair.isSensor) return;

      const bodies = SensorSystem.getCollisionBodies(pair);
      if (bodies) {
        // const s = bodies.sensor;
        // const o = bodies.other;
        // const dX = o.position.x - s.position.x;
        // const dY = o.position.y - s.position.y;

        EventBus.publish(EventType.REACTION, bodies);

        // const result = s.userData.kernel(dX, dY);
        // console.log(result);
        // bodies.sensor.userData.belongsTo.component.activation = result;
      }
    });
  }

  public static onCollisionEnd(event: Phaser.Physics.Matter.Events.CollisionStartEvent): void {
    event.pairs.forEach(pair => {
      if (!pair.isSensor) return;

      const bodies = SensorSystem.getCollisionBodies(pair);
      if (bodies) {
        bodies.sensor.userData.belongsTo.component.activation.set(0);
      }
    });
  }
}
