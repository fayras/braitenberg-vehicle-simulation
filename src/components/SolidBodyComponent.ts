import ComponentType from './types';

enum BodyShape {
  RECTANGLE = 'R',
  CIRCLE = 'C',
}

export default class SolidBodyComponent implements Component {
  public name: ComponentType = ComponentType.SOLID_BODY;

  public size: number;

  public shape: BodyShape;

  public constructor(size: number = 50, shape: BodyShape) {
    this.size = size;
    this.shape = shape;
  }
}
