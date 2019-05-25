import { ComponentType, SubstanceType } from '../enums';
import Component from './Component';

export default class SourceComponent extends Component {
  public name: ComponentType = ComponentType.SOURCE;

  public range: number;

  public substance: SubstanceType;

  public constructor(range: number, substance: SubstanceType = SubstanceType.LIGHT) {
    super();
    this.substance = substance;
    this.range = range;
  }
}
