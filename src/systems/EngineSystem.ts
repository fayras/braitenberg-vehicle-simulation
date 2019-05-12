import Phaser from 'phaser';
import Entity from '../Entity';
import { ComponentType, EventType } from '../enums';
import TransformableComponent from '../components/TransformableComponent';
import MotorComponent from '../components/MotorComponent';
import EventBus from '../EventBus';

export default class EngineSystem implements System {
  public expectedComponents: ComponentType[] = [
    ComponentType.TRANSFORMABLE,
    ComponentType.MOTOR,
    ComponentType.SOLID_BODY,
  ];

  private scene: Phaser.Scene;

  private eventBus: EventBus;

  public constructor(scene: Phaser.Scene, bus: EventBus) {
    this.scene = scene;
    this.eventBus = bus;
  }

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
        const force = Phaser.Physics.Matter.Matter.Vector.rotate({ x: 0, y: thrust * 0.04 }, transform.angle);

        // Vielleicht die Force berechnen und dann per EventBus schicken.
        // Und dann gibt es ein System "ApplyForces"?
        // EngineSystem.applyForce(body, offset, force);
        this.eventBus.publish(EventType.APPLY_FORCE, {
          offset,
          force,
        });
      });
    });
  }
}
