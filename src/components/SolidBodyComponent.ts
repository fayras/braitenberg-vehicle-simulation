import { ComponentType, BodyShape } from '../enums';

export default class SolidBodyComponent implements Component {
  public name: ComponentType = ComponentType.SOLID_BODY;

  public size: number;

  public shape: BodyShape;

  public constructor(size: number = 50, shape: BodyShape = BodyShape.RECTANGLE) {
    this.size = size;
    this.shape = shape;
  }
}
