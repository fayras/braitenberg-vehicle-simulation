import { ComponentType, SubstanceType } from '../enums';
import Component from './Component';
import NumberInput from '../dynamic_input/NumberInput';
import Attribute from './Attribute';
import SelectInput from '../dynamic_input/SelectInput';
import PositionInput from '../dynamic_input/PositionInput';

interface SensorComponentData {
  position: Vector2D;
  range: number;
  angle: number;
  reactsTo?: SubstanceType;
}

export default class SensorComponent extends Component {
  public name: ComponentType = ComponentType.SENSOR;

  public range: Attribute<number, NumberInput>;

  public angle: Attribute<number, NumberInput>;

  public position: Attribute<Vector2D, PositionInput>;

  public activation: Attribute<number, NumberInput>;

  public reactsTo: Attribute<SubstanceType, SelectInput<SubstanceType>>;

  // Konstruktor der Klasse mit Erstellung von Attributen für alle Parameter
  public constructor(data: SensorComponentData) {
    super();
    this.position = new Attribute(data.position, 'Position', PositionInput);
    this.range = new Attribute(data.range, 'Reichweite', NumberInput);
    this.angle = new Attribute(data.angle, 'Öffnungswinkel', NumberInput);
    this.reactsTo = new Attribute(data.reactsTo || SubstanceType.LIGHT, 'Reagiert auf', SelectInput);
    this.activation = new Attribute(0 as number, 'Grad der Aktivierung', NumberInput);
  }
}
