import Phaser from 'phaser';
import Entity from '../Entity';
import ComponentType from '../components/types';
import SensorComponent from '../components/SensorComponent';
import BodyComponent from '../components/BodyComponent';

export default class MotionSystem implements System {
  public expectedComponents: ComponentType[] = [ComponentType.SENSOR, ComponentType.BODY];

  private sensors: { [id: number]: { [id: string]: Phaser.Physics.Matter.Matter.Body } } = {};

  private componentDictionary: { [bodyId: number]: { component: SensorComponent; entity: Entity } } = {};

  private scene: Phaser.Scene;

  public constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.scene.matter.world.on('collisionstart', event => this.onCollision(event));
    this.scene.matter.world.on('collisionend', event => this.onCollisionEnd(event));
  }

  public update(entities: Entity[]): void {
    entities.forEach(entity => {
      const sensors = entity.getMultipleComponents(ComponentType.SENSOR) as SensorComponent[];
      const body = entity.getComponent(ComponentType.BODY) as BodyComponent;

      sensors.forEach(sensorComponent => {
        const sensorObject = this.getSensor(entity, sensorComponent);
        const direction = Phaser.Physics.Matter.Matter.Vector.rotate(sensorComponent.position, body.body.angle);

        Phaser.Physics.Matter.Matter.Body.setPosition(sensorObject, {
          x: body.body.position.x + direction.x,
          y: body.body.position.y + direction.y,
        });

        Phaser.Physics.Matter.Matter.Body.setAngle(sensorObject, body.body.angle);
      });
    });
  }

  private getSensor(entity: Entity, component: SensorComponent): Phaser.Physics.Matter.Matter.Body {
    if (!this.sensors[entity.id]) {
      this.sensors[entity.id] = {};
    }

    const sensorID = `${entity.id}_${component.position.x}_${component.position.y}_${component.range}_${
      component.angle
    }`;

    if (!this.sensors[entity.id][sensorID]) {
      this.sensors[entity.id][sensorID] = MotionSystem.createSensor(component);
      // const angle = Phaser.Math.Angle.BetweenPoints({ x: 0, y: 0 }, component.position);
      // this.sensors[entity.id][sensorID].angle = angle + Math.PI;
      this.componentDictionary[this.sensors[entity.id][sensorID].id] = {
        component,
        entity,
      };
      this.scene.matter.world.add(this.sensors[entity.id][sensorID]);
    }

    return this.sensors[entity.id][sensorID];
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

      console.log('start', bodyA, bodyB);
      const sensor = bodyA.isSensor ? bodyA : bodyB;
      const other = bodyA.isSensor ? bodyB : bodyA;
      const { entity } = this.componentDictionary[sensor.id];
      const body = entity.getComponent(ComponentType.BODY) as BodyComponent;

      if (other !== body.body) {
        this.componentDictionary[sensor.id].component.activation = 1.0;
      }
    });
  }

  public onCollisionEnd(event): void {
    event.pairs.forEach(pair => {
      const { bodyA, bodyB } = pair;
      if (pair.isSensor) {
        console.log('end', bodyA, bodyB);
        const sensor = bodyA.isSensor ? bodyA : bodyB;
        this.componentDictionary[sensor.id].component.activation = 0.0;
        console.log(this.componentDictionary[sensor.id]);
      }
    });
  }
}
