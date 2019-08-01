import { ComponentType } from '../enums';
import Component from './Component';
import Attribute from './Attribute';
import ReadonlyPosition from '../dynamic_input/ReadonlyPosition';
import RotationInput from '../dynamic_input/RotationInput';

interface TransformableComponentData {
  position: Vector2D;
  angle?: number;
}

export default class TransformableComponent extends Component {
  public name: ComponentType = ComponentType.TRANSFORMABLE;

  public position: Attribute<Vector2D, ReadonlyPosition>;

  public angle: Attribute<number, RotationInput>;

  protected maxAmount = 1;

  protected deletable: boolean = false;

  public constructor(data: TransformableComponentData) {
    super();
    this.position = new Attribute(data.position || { x: 0, y: 0 }, 'Position', ReadonlyPosition);
    this.angle = new Attribute(data.angle || 0, 'Rotation', RotationInput);
  }
}
