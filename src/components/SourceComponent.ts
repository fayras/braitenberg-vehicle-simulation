import { ComponentType, SubstanceType, EmissionType } from '../enums';
import Component from './Component';
import Attribute from './Attribute';
import SelectInput from '../dynamic_input/SelectInput';
import NumberInput from '../dynamic_input/NumberInput';

interface SourceComponentData {
  range: number;
  substance?: SubstanceType;
  emissionType?: EmissionType;
}

export default class SourceComponent extends Component {
  public name: ComponentType = ComponentType.SOURCE;

  public range: Attribute<number, NumberInput>;

  public substance: Attribute<SubstanceType, SelectInput<SubstanceType>>;

  public emissionType: Attribute<EmissionType, SelectInput<EmissionType>>;

  public constructor(data: SourceComponentData) {
    super();
    this.range = new Attribute(data.range, 'Reichweite', NumberInput);
    this.substance = new Attribute(data.substance || SubstanceType.LIGHT, 'Substanz', SelectInput);
    this.emissionType = new Attribute(data.emissionType || EmissionType.GAUSSIAN, 'Charakteristik', SelectInput);
  }
}
