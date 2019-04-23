import { ComponentType, SubstanceType } from '../enums';

export default class SourceComponent implements Component {
  public name: ComponentType = ComponentType.SOURCE;

  public range: number;

  public substance: SubstanceType;

  public constructor(range: number, substance: SubstanceType = SubstanceType.LIGHT) {
    this.substance = substance;
    this.range = range;
  }
}
