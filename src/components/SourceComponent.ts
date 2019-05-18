import { ComponentType, SubstanceType } from '../enums';

export default class SourceComponent extends Comment {
  public name: ComponentType = ComponentType.SOURCE;

  public range: number;

  public substance: SubstanceType;

  public constructor(range: number, substance: SubstanceType = SubstanceType.LIGHT) {
    super();
    this.substance = substance;
    this.range = range;
  }
}
