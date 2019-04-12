import Phaser from 'phaser';
import Entity from '../Entity';
import ComponentType from '../components/types';
import BodyComponent from '../components/BodyComponent';
import MotorComponent from '../components/MotorComponent';

export default class MoveSystem implements System {
  public expectedComponents: ComponentType[] = [ComponentType.BODY, ComponentType.MOTOR];

  private amount: number = 1;

  public update(entities: Entity[]): void {
    const all = entities.filter(e => e.hasComponents(ComponentType.BODY));
    this.amount = 1;
    all.forEach(entity => {
      const body = entity.getComponent(ComponentType.BODY) as BodyComponent;
      const motor = entity.getComponent(ComponentType.MOTOR) as MotorComponent;

      const distance = motor.wheelbase;

      // Wir müssen die "Position der Räder" am Vehikel berechnen
      const offsetRight = Phaser.Physics.Matter.Matter.Vector.rotate({ x: distance, y: 0 }, body.body.angle);
      const offsetLeft = Phaser.Physics.Matter.Matter.Vector.rotate({ x: -distance, y: 0 }, body.body.angle);
      // Es muss auch die Richtung "nach vorne" berechnet werden, da das Vehikel eine Rotation
      // haben kann.
      const forceX = Phaser.Physics.Matter.Matter.Vector.rotate({ x: 0, y: 0.000000002 }, body.body.angle);
      const forceY = Phaser.Physics.Matter.Matter.Vector.rotate({ x: 0, y: 0.00001 }, body.body.angle);

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
