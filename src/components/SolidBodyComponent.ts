import { ComponentType, BodyShape } from '../enums';
import Component from './Component';

export default class SolidBodyComponent extends Component {
  public name: ComponentType = ComponentType.SOLID_BODY;

  public size: number;

  public shape: BodyShape;

  public constructor(size: number = 50, shape: BodyShape = BodyShape.RECTANGLE) {
    super();
    this.size = size;
    this.shape = shape;
  }
}
