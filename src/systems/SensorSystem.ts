import Phaser from 'phaser';
import Entity from '../Entity';
import { ComponentType } from '../enums';
import SensorComponent from '../components/SensorComponent';
import TransformableComponent from '../components/TransformableComponent';
import System from './System';
import EventBus from '../EventBus';

export default class SensorSystem extends System {
  public expectedComponents: ComponentType[] = [ComponentType.SENSOR, ComponentType.TRANSFORMABLE];

  private physicsObjects: { [componentId: number]: Phaser.Physics.Matter.Matter.Body } = {};

  public constructor(scene: Phaser.Scene, bus: EventBus) {
    super(scene, bus);
    this.scene.matter.world.on('collisionstart', SensorSystem.onCollision);
    this.scene.matter.world.on('collisionend', SensorSystem.onCollisionEnd);
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

    body.label = ComponentType.SENSOR;
    body.userData = {
      belongsTo: {
        entity: entity.id,
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

  public static onCollision(event: Phaser.Physics.Matter.Events.CollisionStartEvent): void {
    event.pairs.forEach(pair => {
      const { bodyA, bodyB } = pair;
      if (!pair.isSensor || (bodyA.isSensor && bodyB.isSensor)) return;

      // Hier wird noch auf `isSensor` gesprüft. Besser sollte es sein, wenn auf
      // `label` == ComponentType.SENSOR geprüft wird.
      const sensor = bodyA.isSensor ? bodyA : bodyB;
      sensor.userData.belongsTo.component.activation = 1.0;

      // this.eventBus.publish(EventType.SENSOR_ACTIVE, {
      //   id: componentId,
      //   activation: 1.0,
      // });
    });
  }

  public static onCollisionEnd(event: Phaser.Physics.Matter.Events.CollisionStartEvent): void {
    event.pairs.forEach(pair => {
      const { bodyA, bodyB } = pair;
      if (pair.isSensor) {
        const sensor = bodyA.isSensor ? bodyA : bodyB;
        sensor.userData.belongsTo.component.activation = 0.0;

        // this.eventBus.publish(EventType.SENSOR_ACTIVE, {
        //   id: componentId,
        //   activation: 0.0,
        // });
      }
    });
  }
}
