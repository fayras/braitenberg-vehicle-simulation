import Phaser from 'phaser';
import Entity from '../Entity';
import { ComponentType, EventType } from '../enums';
import SensorComponent from '../components/SensorComponent';
import TransformableComponent from '../components/TransformableComponent';
import System from './System';
import EventBus from '../EventBus';
import { gaussian } from '../utils/reactions';

export default class SensorSystem extends System {
  public expectedComponents: ComponentType[] = [ComponentType.SENSOR, ComponentType.TRANSFORMABLE];

  private physicsObjects: { [componentId: number]: SensorPhysicsObject } = {};

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

  private addSensorObject(entity: Entity, sensor: SensorComponent): SensorPhysicsObject {
    const body = SensorSystem.createSensor(sensor) as SensorPhysicsObject;

    this.attachSynchronization(body, entity, sensor);

    body.label = ComponentType.SENSOR;
    body.userData = {
      kernel: gaussian({ x: 0, y: 0 }, { x: sensor.angle * 20, y: sensor.range }),
      belongsTo: {
        entity,
        // TODO: Hier wird jetzt die Referenz auf die gesamte Komponente gespeichert.
        // Wäre es besser hier nur die ID zu speichern und dann später mittels sowas
        // wie `EntityManager` die Komponente über die ID zu holen?
        component: sensor,
      },
    };
    this.scene.matter.world.add(body);
    this.physicsObjects[sensor.id] = body;

    return body;
  }

  private attachSynchronization(
    body: Phaser.Physics.Matter.Matter.Body,
    entity: Entity,
    component: SensorComponent,
  ): void {
    const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;

    // Hier brauchen wir nur `beforeupdate` (Kein `afterupdate`), da die Position und Winkel
    // des Sensors immer relativ zum Objekt selbst sind und somit nicht durch die Physik-
    // Engine beeinflusst werden.
    this.scene.matter.world.on('beforeupdate', () => {
      const direction = Phaser.Physics.Matter.Matter.Vector.rotate(component.position, transform.angle);
      Phaser.Physics.Matter.Matter.Body.setPosition(body, {
        x: transform.position.x + direction.x,
        y: transform.position.y + direction.y,
      });
      Phaser.Physics.Matter.Matter.Body.setAngle(body, transform.angle);
    });
  }

  private static createSensor(component: SensorComponent): Phaser.Physics.Matter.Matter.Body {
    const direction = Phaser.Physics.Matter.Matter.Vector.normalise(component.position);
    const fullVector = Phaser.Physics.Matter.Matter.Vector.mult(direction, component.range);
    const vertices = [
      { x: 0, y: 0 },
      Phaser.Physics.Matter.Matter.Vector.rotate(fullVector, component.angle / 2),
      Phaser.Physics.Matter.Matter.Vector.rotate(fullVector, -component.angle / 2),
    ];
    const body = Phaser.Physics.Matter.Matter.Bodies.fromVertices(0, 0, [vertices], {
      isSensor: true,
    });

    const offset = Phaser.Physics.Matter.Matter.Vertices.centre(vertices);

    // Hier muss die Position gesetzt werden, was ein Workaround
    // dafür ist Origin-Punkt des Dreiecks zu setzen.
    body.positionPrev.x -= offset.x;
    body.positionPrev.y -= offset.y;
    body.position.x -= offset.x;
    body.position.y -= offset.y;

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
        bodies.sensor.userData.belongsTo.component.activation = 0.0;
      }
    });
  }
}
