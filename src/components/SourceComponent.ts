import { ComponentType, SubstanceType, EmissionType } from '../enums';
import Component from './Component';

export default class SourceComponent extends Component {
  public name: ComponentType = ComponentType.SOURCE;

  public range: number;

  public substance: SubstanceType;

  public emissionType: EmissionType;

  public constructor(range: number, substance = SubstanceType.LIGHT, emission = EmissionType.GAUSSIAN) {
    super();
    this.substance = substance;
    this.range = range;
    this.emissionType = emission;
  }

  public serializeAttributes(): object {
    return {
      substance: this.substance,
      range: this.range,
    };
  }
}
