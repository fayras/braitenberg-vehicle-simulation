import { ComponentType, SubstanceType, EmissionType } from '../enums';
import Component from './Component';
import RenderableAttribute from './RenderableAttribute';
import SelectInput from '../gui/Inputs/SelectInput';
import NumberInput from '../gui/Inputs/NumberInput';

interface SourceComponentData {
  range: number;
  substance?: SubstanceType;
  emissionType?: EmissionType;
}

export default class SourceComponent extends Component {
  public name: ComponentType = ComponentType.SOURCE;

  public range: RenderableAttribute<number, typeof NumberInput>;

  public substance: RenderableAttribute<SubstanceType, typeof SelectInput>;

  public emissionType: RenderableAttribute<EmissionType, typeof SelectInput>;

  public constructor(data: SourceComponentData) {
    super();
    this.range = new RenderableAttribute(data.range, NumberInput, { label: 'Reichweite' });
    this.substance = new RenderableAttribute(data.substance || SubstanceType.LIGHT, SelectInput, {
      label: 'Substanz',
      options: SubstanceType,
    });
    this.emissionType = new RenderableAttribute(data.emissionType || EmissionType.GAUSSIAN, SelectInput, {
      label: 'Charakteristik',
      options: EmissionType,
    });
  }
}
