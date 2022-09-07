import Phaser from 'phaser';
import { ComponentType, EmissionType, SubstanceType } from '../enums';
import { ECSComponent } from './ECSComponent';
import { RenderableAttribute } from './attributes/RenderableAttribute';
import { VolatileAttribute } from './attributes/VolatileAttribute';
import { SelectInput } from '../gui/Inputs/SelectInput';
import { NumberInput } from '../gui/Inputs/NumberInput';

export type Renderable = Phaser.GameObjects.Image;

interface SourceComponentData {
  range: number;
  substance?: SubstanceType;
  emissionType?: EmissionType;
}

export class SourceComponent extends ECSComponent {
  public label = 'Quelle';

  public type: ComponentType = ComponentType.SOURCE;

  public range: RenderableAttribute<number, typeof NumberInput>;

  public substance: RenderableAttribute<SubstanceType, typeof SelectInput>;

  public emissionType: RenderableAttribute<EmissionType, typeof SelectInput>;

  public renderableObject: VolatileAttribute<Renderable>;

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

    this.renderableObject = new VolatileAttribute();
  }
}
