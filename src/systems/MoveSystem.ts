import Phaser from 'phaser';
import Entity from '../Entity';
import ComponentType from '../components/types';
import BodyComponent from '../components/BodyComponent';
import MotorComponent from '../components/MotorComponent';
import SensorComponent from '../components/SensorComponent';

export default class MoveSystem implements System {
  public expectedComponents: ComponentType[] = [ComponentType.BODY, ComponentType.MOTOR];

  private amount: number = 1;

  public update(entities: Entity[]): void {
    this.amount = 1;
    entities.forEach(entity => {
      const body = entity.getComponent(ComponentType.BODY) as BodyComponent;
      const motor = entity.getComponent(ComponentType.MOTOR) as MotorComponent;

      const distance = motor.wheelbase;

      // Wir müssen die "Position der Räder" am Vehikel berechnen
      const offsetRight = Phaser.Physics.Matter.Matter.Vector.rotate({ x: distance, y: 0 }, body.body.angle);
      const offsetLeft = Phaser.Physics.Matter.Matter.Vector.rotate({ x: -distance, y: 0 }, body.body.angle);
      // Es muss auch die Richtung "nach vorne" berechnet werden, da das Vehikel eine Rotation
      // haben kann.
      const forceX = Phaser.Physics.Matter.Matter.Vector.rotate({ x: 0, y: 0.00007 }, body.body.angle);
      const forceY = Phaser.Physics.Matter.Matter.Vector.rotate({ x: 0, y: 0.00007 }, body.body.angle);

      const sensors = entity.getMultipleComponents(ComponentType.SENSOR) as SensorComponent[];
      const sensorActivation = sensors.reduce((p, c) => p + c.activation, 0);
      if (sensorActivation > 0) {
        forceX.x *= 1.5;
        forceX.y *= 1.5;
        forceY.x *= -1;
        forceY.y *= -1;
      }

      MoveSystem.applyForce(body.body, offsetRight, forceX);
      MoveSystem.applyForce(body.body, offsetLeft, forceY);
    });
  }

  private static applyForce(
    body: Phaser.Physics.Matter.Matter.Body,
    offset: Phaser.Physics.Matter.Matter.Vector,
    force: Phaser.Physics.Matter.Matter.Vector,
  ): void {
    Phaser.Physics.Matter.Matter.Body.applyForce(
      body,
      { x: body.position.x + offset.x, y: body.position.y + offset.y },
      force,
    );
  }
}
