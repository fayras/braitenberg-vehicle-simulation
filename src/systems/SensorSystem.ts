import Phaser from 'phaser';
import Entity from '../Entity';
import { ComponentType, EventType } from '../enums';
import SensorComponent from '../components/SensorComponent';
import TransformableComponent from '../components/TransformableComponent';
import System from './System';
import EventBus from '../EventBus';

export default class SensorSystem extends System {
  public expectedComponents: ComponentType[] = [ComponentType.SENSOR, ComponentType.TRANSFORMABLE];

  private physicsObjects: { [componentId: number]: Phaser.Physics.Matter.Matter.Body } = {};

  private physicsToComponentDictionary: { [bodyId: number]: number } = {};

  public constructor(scene: Phaser.Scene, bus: EventBus) {
    super(scene, bus);
    this.scene.matter.world.on('collisionstart', event => this.onCollision(event));
    this.scene.matter.world.on('collisionend', event => this.onCollisionEnd(event));
  }

  public update(entities: Entity[]): void {
    entities.forEach(entity => {
      const sensors = entity.getMultipleComponents(ComponentType.SENSOR) as SensorComponent[];

      sensors.forEach(sensor => {
        if (!this.physicsObjects[sensor.id]) this.addSensorObject(entity, sensor);
      });
    });
  }

  private addSensorObject(entity: Entity, sensor: SensorComponent): Phaser.Physics.Matter.Matter.Body {
    const body = SensorSystem.createSensor(sensor);

    this.attachSynchronization(body, entity, sensor);

    this.scene.matter.world.add(body);
    this.physicsObjects[sensor.id] = body;
    this.physicsToComponentDictionary[body.id] = sensor.id;

    return body;
  }

  private attachSynchronization(
    body: Phaser.Physics.Matter.Matter.Body,
    entity: Entity,
    component: SensorComponent,
  ): void {
    const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;

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

  public onCollision(event): void {
    event.pairs.forEach(pair => {
      const { bodyA, bodyB } = pair;
      if (!pair.isSensor || (bodyA.isSensor && bodyB.isSensor)) return;

      const sensor = bodyA.isSensor ? bodyA : bodyB;
      // const other = bodyA.isSensor ? bodyB : bodyA;
      const componentId = this.physicsToComponentDictionary[sensor.id];

      // if (other !== body) {
      this.eventBus.publish(EventType.SENSOR_ACTIVE, {
        id: componentId,
        activation: 1.0,
      });
      // }
    });
  }

  public onCollisionEnd(event): void {
    event.pairs.forEach(pair => {
      const { bodyA, bodyB } = pair;
      if (pair.isSensor) {
        const sensor = bodyA.isSensor ? bodyA : bodyB;
        const componentId = this.physicsToComponentDictionary[sensor.id];

        this.eventBus.publish(EventType.SENSOR_ACTIVE, {
          id: componentId,
          activation: 0.0,
        });
      }
    });
  }
}
