import Phaser from 'phaser';
import { System } from './System';
import { Entity } from '../Entity';
import { ComponentType } from '../enums';
import { TransformableComponent } from '../components/TransformableComponent';
import { MotorComponent } from '../components/MotorComponent';
import { RectangleBodyComponent } from '../components/RectangleBodyComponent';
import { CircleBodyComponent } from '../components/CircleBodyComponent';

export class MovementSystem extends System {
  public constructor(scene: Phaser.Scene) {
    super(scene, [ComponentType.TRANSFORMABLE, ComponentType.MOTOR]);
  }

  protected enter(): void {}

  protected exit(): void {}

  public override internalUpdate(entities: ReadonlySet<Entity>): void {
    entities.forEach((entity) => {
      const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
      const motor = entity.getComponent(ComponentType.MOTOR) as MotorComponent;

      const parent = entity.getParent();
      const parentTransform = parent?.getComponent<TransformableComponent>(ComponentType.TRANSFORMABLE);
      const solidBody =
        parent?.getComponent<RectangleBodyComponent>(ComponentType.SOLID_BODY_RECT) ||
        parent?.getComponent<CircleBodyComponent>(ComponentType.SOLID_BODY_CIRCLE);

      // Wir müssen die neue "Position des Motors" am Vehikel berechnen
      const offset = Phaser.Physics.Matter.Matter.Vector.rotate(
        transform.position.value,
        (parentTransform || transform).angle.value,
      );
      // const throttle = Math.min(motor.throttle, 1);
      // const thrust = Math.max(motor.defaultSpeed.get(), throttle * motor.maxSpeed.get());

      const base = Number(motor.defaultSpeed.value);
      const max = Number(motor.maxSpeed.value);
      const thrust = base + (max - base) * motor.throttle.value;

      // motor.visualThrottle.value = thrust.toFixed(2);

      // Es muss auch die Richtung "nach vorne" berechnet werden, da das Vehikel eine Rotation
      // haben kann.
      const force = Phaser.Physics.Matter.Matter.Vector.rotate(
        { x: 0, y: thrust * 0.001 },
        (parentTransform || transform).angle.value,
      );

      const body = solidBody?.physicsBody.value;
      if (!body) return;

      const Vec = Phaser.Physics.Matter.Matter.Vector;
      const t = Vec.cross(Vec.neg(offset), force);

      // Das Drehmoment wird hier manuell berechnet, da `applyForce` nicht selbstständig
      // das Drehmoment berechnet. Die Formel stimmt nicht mit der Realität überein,
      // fühlt sich in der Simulation besser an, da das Vehikel schneller zur bzw.
      // weg von der Quelle dreht.
      // Die Potenz sorgt dafür, dass kleinere Drehungen mehr Drehmoment erzeugen und das
      // Vehikel sich dadurch eher dreht. Es ist wichtig eine ungerade Potenz zu nehmen,
      // damit entgegengesetztes Drehmoment die Rotatioin ausgleicht.
      body.torque -= (t + Math.sign(t)) ** 5;

      // console.log(body.torque, t);

      Phaser.Physics.Matter.Matter.Body.applyForce(
        body,
        { x: body.position.x + offset.x, y: body.position.y + offset.y },
        force,
      );
    });
  }
}
