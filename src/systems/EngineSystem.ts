import Phaser from 'phaser';
import System from './System';
import Entity from '../Entity';
import { ComponentType, EventType } from '../enums';
import TransformableComponent from '../components/TransformableComponent';
import MotorComponent from '../components/MotorComponent';
import EventBus from '../EventBus';

export default class EngineSystem extends System {
  public expectedComponents: ComponentType[] = [ComponentType.TRANSFORMABLE, ComponentType.MOTOR];

  public update(): void {
    this.entities.forEach(entity => {
      const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
      const motors = entity.getMultipleComponents(ComponentType.MOTOR) as MotorComponent[];

      motors.forEach(motor => {
        // Wir müssen die neue "Position des Motors" am Vehikel berechnen
        const offset = Phaser.Physics.Matter.Matter.Vector.rotate(motor.position.get(), transform.angle.get());
        const slope = motor.maxSpeed.get() - motor.defaultSpeed.get();
        const thrust = motor.defaultSpeed.get() + motor.throttle.get() * slope;

        // Es muss auch die Richtung "nach vorne" berechnet werden, da das Vehikel eine Rotation
        // haben kann.
        const force = Phaser.Physics.Matter.Matter.Vector.rotate({ x: 0, y: thrust * 0.001 }, transform.angle.get());

        EventBus.publish(EventType.APPLY_FORCE, {
          id: entity.id,
          offset,
          force,
        });
      });
    });
  }

  protected onEntityCreated(entity: Entity): void {
    this.entities.push(entity);
  }

  protected onEntityDestroyed(entity: Entity): void {
    const index = this.entities.findIndex(e => e.id === entity.id);
    if (index > -1) {
      this.entities.splice(index, 1);
    }
  }
}
