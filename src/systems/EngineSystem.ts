import Phaser from 'phaser';
import System from './System';
import Entity from '../Entity';
import { ComponentType, EventType } from '../enums';
import TransformableComponent from '../components/TransformableComponent';
import MotorComponent from '../components/MotorComponent';

export default class EngineSystem extends System {
  public expectedComponents: ComponentType[] = [ComponentType.TRANSFORMABLE, ComponentType.MOTOR];

  public update(entities: Entity[]): void {
    entities.forEach(entity => {
      const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
      const motors = entity.getMultipleComponents(ComponentType.MOTOR) as MotorComponent[];

      motors.forEach(motor => {
        // Wir müssen die neue "Position des Motors" am Vehikel berechnen
        const offset = Phaser.Physics.Matter.Matter.Vector.rotate(motor.position, transform.angle);

        const slope = motor.maxSpeed - motor.defaultSpeed;

        const throttle = 0.7;
        const thrust = throttle * slope;

        // Es muss auch die Richtung "nach vorne" berechnet werden, da das Vehikel eine Rotation
        // haben kann.
        const force = Phaser.Physics.Matter.Matter.Vector.rotate({ x: 0, y: thrust * 0.0005 }, transform.angle);

        this.eventBus.publish(EventType.APPLY_FORCE, {
          id: entity.id,
          offset,
          force,
        });
      });
    });
  }
}
