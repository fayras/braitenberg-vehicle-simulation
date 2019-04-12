import Phaser from 'phaser';
import Entity from '../Entity';
import ComponentType from '../components/types';
import BodyComponent from '../components/BodyComponent';
import MotorComponent from '../components/MotorComponent';

export default class MoveSystem implements System {
  public expectedComponents: ComponentType[] = [ComponentType.BODY, ComponentType.MOTOR];

  private amount: number = 1;

  public update(entities: Entity[], delta: number): void {
    const all = entities.filter(e => e.hasComponents(ComponentType.BODY));
    this.amount = 1;
    all.forEach(entity => {
      const body = entity.getComponent(ComponentType.BODY) as BodyComponent;
      const motor = entity.getComponent(ComponentType.MOTOR) as MotorComponent;
      const distance = 17;

      // So funtioniert das nicht richtig. Vielleicht Composites benutzen?
      Phaser.Physics.Matter.Matter.Body.applyForce(
        body.body,
        { x: body.body.position.x + distance, y: body.body.position.y },
        { x: 0, y: 0.002 },
      );
      Phaser.Physics.Matter.Matter.Body.applyForce(
        body.body,
        { x: body.body.position.x - distance, y: body.body.position.y },
        { x: 0, y: 0.1 },
      );
    });
  }
}
