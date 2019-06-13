import { ComponentType, BodyShape } from '../enums';
import Component from './Component';

export default class SolidBodyComponent extends Component {
  public name: ComponentType = ComponentType.SOLID_BODY;

  public size: number;

  public shape: BodyShape;

  public mass: number | undefined;

  public constructor(size: number = 50, shape: BodyShape = BodyShape.RECTANGLE, mass: number | undefined = undefined) {
    super();
    this.size = size;
    this.shape = shape;
    this.mass = mass;
  }

  public serializeAttributes(): object {
    return {
      size: this.size,
      shape: this.shape,
      mass: this.mass,
    };
  }
}
