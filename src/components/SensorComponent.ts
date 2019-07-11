import { ComponentType, SensorActivation, SubstanceType } from '../enums';
import Component from './Component';
import NumberInput from '../dynamic_input/NumberInput';
import Attribute from './Attribute';
import SelectInput from '../dynamic_input/SelectInput';
import PositionInput from '../dynamic_input/PositionInput';

export default class SensorComponent extends Component {
  public name: ComponentType = ComponentType.SENSOR;

  public range: Attribute<number, NumberInput>;

  public angle: Attribute<number, NumberInput>;

  public position: Attribute<Vector2D, PositionInput>;

  public activation: Attribute<number, NumberInput>; // = 0.0;

  // public type: SensorActivation = SensorActivation.LINEAR;

  public reactsTo: Attribute<SubstanceType, SelectInput<SubstanceType>>;

  public constructor(
    offsetPos: Phaser.Physics.Matter.Matter.Vector,
    range: number,
    angle: number,
    reactsTo: SubstanceType = SubstanceType.LIGHT,
  ) {
    super();
    this.position = new Attribute(offsetPos, 'Position', PositionInput);
    this.range = new Attribute(range, 'Reichweite', NumberInput);
    this.angle = new Attribute(angle, 'Öffnungswinkel', NumberInput);
    this.reactsTo = new Attribute(reactsTo, 'Reagiert auf', SelectInput);
    this.activation = new Attribute(0 as number, 'activation', NumberInput);
  }

  public serializeAttributes(): object {
    return {
      position: this.position.get(),
      range: this.range.get(),
      angle: this.angle.get(),
      reactsTo: this.reactsTo.get(),
    };
  }
}
