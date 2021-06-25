import { ComponentType, SubstanceType } from '../enums';
import Component from './Component';
import RenderableAttribute from './RenderableAttribute';
import NumberInput from '../gui/NumberInput';
import SelectInput from '../gui/SelectInput';
import PositionInput from '../gui/PositionInput';

interface SensorComponentData {
  position: Vector2D;
  range: number;
  angle: number;
  reactsTo?: SubstanceType;
}

export default class SensorComponent extends Component {
  public name: ComponentType = ComponentType.SENSOR;

  public range: RenderableAttribute<number, typeof NumberInput>;

  public angle: RenderableAttribute<number, typeof NumberInput>;

  public position: RenderableAttribute<Vector2D, typeof PositionInput>;

  public activation: RenderableAttribute<number, typeof NumberInput>;

  public reactsTo: RenderableAttribute<SubstanceType, typeof SelectInput>;

  // Konstruktor der Klasse mit Erstellung von Attributen für alle Parameter
  public constructor(data: SensorComponentData) {
    super();
    this.position = new RenderableAttribute(data.position, PositionInput, { label: 'Position' });
    this.range = new RenderableAttribute(data.range, NumberInput, { label: 'Reichweite' });
    this.angle = new RenderableAttribute(data.angle, NumberInput, { label: 'Öffnungswinkel' });
    this.reactsTo = new RenderableAttribute(data.reactsTo || SubstanceType.LIGHT, SelectInput, {
      label: 'Reagiert auf',
      options: SubstanceType,
    });
    this.activation = new RenderableAttribute(0 as number, NumberInput, {
      label: 'Grad der Aktivierung' /* toFixed: 4 */,
    });
  }
}
