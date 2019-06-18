import { ComponentType, SubstanceType, EmissionType } from '../enums';
import Component from './Component';
import Attribute from './Attribute';
import SelectInput from '../dynamic_input/SelectInput';
import NumberInput from '../dynamic_input/NumberInput';

export default class SourceComponent extends Component {
  public name: ComponentType = ComponentType.SOURCE;

  public range: Attribute<number, NumberInput>;

  public substance: Attribute<SubstanceType, SelectInput<SubstanceType>>;

  public emissionType: Attribute<EmissionType, SelectInput<EmissionType>>;

  public constructor(range: number, substance = SubstanceType.LIGHT, emission = EmissionType.GAUSSIAN) {
    super();
    this.range = new Attribute(range, 'Reichweite', NumberInput);
    this.substance = new Attribute(substance, 'Substanz', SelectInput);
    this.emissionType = new Attribute(emission, 'Charakteristik', SelectInput);
  }

  public serializeAttributes(): object {
    return {
      substance: this.substance.get(),
      range: this.range.get(),
    };
  }
}
