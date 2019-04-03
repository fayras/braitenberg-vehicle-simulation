import Entity from '../Entity';
import ComponentType from '../components/types';
import PhysicsComponent from '../components/PhysicsComponent';

export default class MoveSystem implements System {
  private amount: number = 1;

  public update(entities: Entity[], delta: number): void {
    const all = entities.filter(e => e.hasComponents(ComponentType.PHYSICS));
    all.forEach(entity => {
      const component = entity.getComponent(ComponentType.PHYSICS) as PhysicsComponent;
      component.position.x += this.amount;
    });
  }
}
