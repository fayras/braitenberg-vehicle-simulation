import Phaser from 'phaser';
import Entity from '../Entity';
import ComponentType from '../components/types';
import SensorComponent from '../components/SensorComponent';
import BodyComponent from '../components/BodyComponent';

export default class SensorSystem implements System {
  public expectedComponents: ComponentType[] = [ComponentType.SENSOR, ComponentType.BODY];

  private sensors: { [id: number]: { [id: string]: Phaser.Physics.Matter.Matter.Body } } = {};

  private componentDictionary: { [bodyId: number]: SensorComponent } = {};

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
      this.sensors[entity.id][sensorID] = Phaser.Physics.Matter.Matter.Bodies.circle(0, 0, component.range, {
        isSensor: true,
      });
      this.componentDictionary[this.sensors[entity.id][sensorID].id] = component;
      this.scene.matter.world.add(this.sensors[entity.id][sensorID]);
    }

    return this.sensors[entity.id][sensorID];
  }

  public onCollision(event): void {
    event.pairs.forEach(pair => {
      const { bodyA, bodyB } = pair;
      if (pair.isSensor && !(bodyA.isSensor && bodyB.isSensor)) {
        console.log('start', bodyA, bodyB);
        const sensor = bodyA.isSensor ? bodyA : bodyB;
        this.componentDictionary[sensor.id].activation = 1.0;
      }
    });
  }

  public onCollisionEnd(event): void {
    event.pairs.forEach(pair => {
      const { bodyA, bodyB } = pair;
      if (pair.isSensor) {
        console.log('end', bodyA, bodyB);
        const sensor = bodyA.isSensor ? bodyA : bodyB;
        this.componentDictionary[sensor.id].activation = 0.0;
        console.log(this.componentDictionary[sensor.id]);
      }
    });
  }
}
