import { ComponentType } from '../enums';
import Component from './Component';
import Attribute from './Attribute';
import PositionInput from '../dynamic_input/PositionInput';
import NumberInput from '../dynamic_input/NumberInput';

export default class TransformableComponent extends Component {
  public name: ComponentType = ComponentType.TRANSFORMABLE;

  public position: Attribute<Vector2D, PositionInput>;

  public angle: Attribute<number, NumberInput>;

  public constructor(pos: Vector2D = { x: 0, y: 0 }) {
    super();
    this.position = new Attribute(pos, 'Position', PositionInput);
    this.angle = new Attribute(0 as number, 'Winkel', NumberInput);
  }

  public serializeAttributes(): object {
    return {
      position: this.position.get(),
      angle: this.angle.get(),
    };
  }
}
