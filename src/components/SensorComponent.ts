import Phaser from 'phaser';
import { ComponentType, SubstanceType } from '../enums';
import { ECSComponent } from './ECSComponent';
import { RenderableAttribute } from './attributes/RenderableAttribute';
import { VolatileAttribute } from './attributes/VolatileAttribute';
import { NumberInput } from '../gui/Inputs/NumberInput';
import { SelectInput } from '../gui/Inputs/SelectInput';

export type Renderable = Phaser.GameObjects.Image;

interface SensorComponentData {
  range: number;
  angle: number;
  reactsTo?: SubstanceType;
}

export class SensorComponent extends ECSComponent {
  public label = 'Sensor';

  public type: ComponentType = ComponentType.SENSOR;

  public range: RenderableAttribute<number, typeof NumberInput>;

  public angle: RenderableAttribute<number, typeof NumberInput>;

  public activation: RenderableAttribute<number, typeof NumberInput>;

  public reactsTo: RenderableAttribute<SubstanceType, typeof SelectInput>;

  public renderableObject: VolatileAttribute<Renderable>;

  // Konstruktor der Klasse mit Erstellung von Attributen für alle Parameter
  public constructor(data: SensorComponentData) {
    super();
    this.range = new RenderableAttribute(data.range, NumberInput, { label: 'Reichweite' });
    this.angle = new RenderableAttribute(data.angle, NumberInput, { label: 'Öffnungswinkel' });
    this.reactsTo = new RenderableAttribute(data.reactsTo || SubstanceType.LIGHT, SelectInput, {
      label: 'Reagiert auf',
      options: SubstanceType,
    });
    this.activation = new RenderableAttribute(0 as number, NumberInput, {
      label: 'Grad der Aktivierung' /* toFixed: 4 */,
    });

    this.renderableObject = new VolatileAttribute();
  }
}
