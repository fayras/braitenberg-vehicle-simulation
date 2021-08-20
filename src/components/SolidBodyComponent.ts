import { ComponentType, BodyShape } from '../enums';
import Component from './Component';
import RenderableAttribute from './RenderableAttribute';
import SelectInput from '../gui/Inputs/SelectInput';
import CheckboxInput from '../gui/Inputs/CheckboxInput';
import SizeInput from '../gui/Inputs/SizeInput';

interface SolidBodyComponentData {
  size?: Dimensions | number;
  shape?: BodyShape;
  isStatic?: boolean;
}

export default class SolidBodyComponent extends Component {
  public name: ComponentType = ComponentType.SOLID_BODY;

  public size: RenderableAttribute<Dimensions, typeof SizeInput>;

  public shape: RenderableAttribute<BodyShape, typeof SelectInput>;

  public isStatic: RenderableAttribute<boolean, typeof CheckboxInput>;

  protected maxAmount = 1;

  public constructor(data: SolidBodyComponentData) {
    super();
    if (typeof data.size === 'number') {
      this.size = new RenderableAttribute({ width: data.size, height: data.size }, SizeInput, {
        label: 'Größe',
        /* min: 20,
        max: 500, */
      });
    } else {
      this.size = new RenderableAttribute(data.size || { width: 50, height: 50 }, SizeInput, {
        label: 'Größe',
        /* min: 20,
        max: 500, */
      });
    }
    this.shape = new RenderableAttribute(data.shape || BodyShape.RECTANGLE, SelectInput, {
      label: 'Form',
      options: BodyShape,
    });
    this.isStatic = new RenderableAttribute(data.isStatic || false, CheckboxInput, { label: 'Statisch' });
  }
}
