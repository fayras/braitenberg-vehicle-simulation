import { ComponentType, BodyShape } from '../enums';
import Component from './Component';
import Attribute from './Attribute';
import SelectInput from '../dynamic_input/SelectInput';
import Checkbox from '../dynamic_input/Checkbox';
import SizeInput from '../dynamic_input/SizeInput';

export default class SolidBodyComponent extends Component {
  public name: ComponentType = ComponentType.SOLID_BODY;

  public size: Attribute<Dimensions, SizeInput>;

  public shape: Attribute<BodyShape, SelectInput<BodyShape>>;

  public isStatic: Attribute<boolean, Checkbox>;

  public constructor(
    size: Dimensions | number = 50,
    shape: BodyShape = BodyShape.RECTANGLE,
    isStatic: boolean = false,
  ) {
    super();
    if (typeof size === 'number') {
      this.size = new Attribute({ width: size, height: size }, 'Größe', SizeInput);
    } else {
      this.size = new Attribute(size, 'Größe', SizeInput);
    }
    this.shape = new Attribute(shape, 'Form', SelectInput);
    this.isStatic = new Attribute(isStatic, 'Statisch', Checkbox);
  }

  public serializeAttributes(): object {
    return {
      size: this.size.get(),
      shape: this.shape.get(),
      isStatic: this.isStatic.get(),
    };
  }
}
