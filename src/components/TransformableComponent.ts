import { ComponentType } from '../enums';
import Component from './Component';
import RenderableAttribute from './RenderableAttribute';
import PositionInput from '../gui/PositionInput';
import RotationInput from '../gui/RotationInput';

interface TransformableComponentData {
  position: Vector2D;
  angle?: number;
}

export default class TransformableComponent extends Component {
  public name: ComponentType = ComponentType.TRANSFORMABLE;

  public position: RenderableAttribute<Vector2D, typeof PositionInput>;

  public angle: RenderableAttribute<number, typeof RotationInput>;

  protected maxAmount = 1;

  protected deletable: boolean = false;

  public constructor(data: TransformableComponentData) {
    super();
    this.position = new RenderableAttribute(data.position || { x: 0, y: 0 }, PositionInput, { label: 'Position' });
    this.angle = new RenderableAttribute(data.angle || 0, RotationInput, { label: 'Rotation' });
  }
}
