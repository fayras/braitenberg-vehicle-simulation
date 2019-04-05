import Entity from '../Entity';
import ComponentType from '../components/types';
import BodyComponent from '../components/BodyComponent';

export default class MoveSystem implements System {
  public expectedComponents: ComponentType[] = [ComponentType.BODY];

  private amount: number = 1;

  public update(entities: Entity[], delta: number): void {
    const all = entities.filter(e => e.hasComponents(ComponentType.BODY));
    all.forEach(entity => {
      const component = entity.getComponent(ComponentType.BODY) as BodyComponent;
      component.body.position.x += this.amount;
    });
  }
}
