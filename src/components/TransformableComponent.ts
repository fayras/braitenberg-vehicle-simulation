import { ComponentType } from '../enums';
import { ECSComponent } from './ECSComponent';
import { RenderableAttribute } from './attributes/RenderableAttribute';
import { PositionInput } from '../gui/Inputs/PositionInput';
import { RotationInput } from '../gui/Inputs/RotationInput';

interface TransformableComponentData {
  position: Vector2D;
  angle?: number;
}

export class TransformableComponent extends ECSComponent {
  public label = 'Transform';

  public type: ComponentType = ComponentType.TRANSFORMABLE;

  public position: RenderableAttribute<Vector2D, typeof PositionInput>;

  public angle: RenderableAttribute<number, typeof RotationInput>;

  protected deletable = false;

  public constructor(data: TransformableComponentData) {
    super();
    this.position = new RenderableAttribute(data.position || { x: 0, y: 0 }, PositionInput, { label: 'Position' });
    this.angle = new RenderableAttribute(data.angle || 0, RotationInput, { label: 'Rotation' });
  }
}
