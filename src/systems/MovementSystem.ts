import Phaser from 'phaser';
import System from './System';
import { EntityID, Entity } from '../Entity';
import { ComponentType } from '../enums';
import RenderComponent from '../components/RenderComponent';
import TransformableComponent from '../components/TransformableComponent';
import { store as selectedEntityStore } from '../gui/_store/selectedEntity';
import { autorun, reaction, IReactionDisposer } from 'mobx';
import MotorComponent from '../components/MotorComponent';
import SolidBodyComponent from '../components/SolidBodyComponent';

export class MovementSystem extends System {
  public constructor(scene: Phaser.Scene) {
    super(scene, [ComponentType.TRANSFORMABLE, ComponentType.MOTOR, ComponentType.SOLID_BODY]);
  }

  public override internalUpdate(entities: ReadonlySet<Entity>, delta: number): void {
    entities.forEach((entity) => {
      const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
      const solidBody = entity.getComponent(ComponentType.SOLID_BODY) as SolidBodyComponent;
      const motors = entity.getComponents(ComponentType.MOTOR) as MotorComponent[];

      motors.forEach((motor) => {
        // Wir müssen die neue "Position des Motors" am Vehikel berechnen
        const offset = Phaser.Physics.Matter.Matter.Vector.rotate(motor.position.value, transform.angle.value);
        // const throttle = Math.min(motor.throttle, 1);
        // const thrust = Math.max(motor.defaultSpeed.get(), throttle * motor.maxSpeed.get());

        const base = Number(motor.defaultSpeed.value);
        const max = Number(motor.maxSpeed.value);
        const thrust = base + (max - base) * motor.throttle.value;

        motor.visualThrottle.value = thrust.toFixed(2);

        // Es muss auch die Richtung "nach vorne" berechnet werden, da das Vehikel eine Rotation
        // haben kann.
        const force = Phaser.Physics.Matter.Matter.Vector.rotate({ x: 0, y: thrust * 0.001 }, transform.angle.value);

        const body = solidBody.physicsBody;
        if (!body) return;

        const V = Phaser.Physics.Matter.Matter.Vector;
        const t = V.cross(V.neg(offset), force);

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
    });
  }
}
