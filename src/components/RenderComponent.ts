import Phaser from 'phaser';
import { ComponentType } from '../enums';
import Component from './Component';
import Attribute from './Attribute';
import TextInput from '../dynamic_input/TextInput';
import NumberInput from '../dynamic_input/NumberInput';
import SelectInput from '../dynamic_input/SelectInput';

interface RenderComponentData {
  asset: AssetKey | Color;
  size: number;
  blendMode?: Phaser.BlendModes;
}

export default class RenderComponent extends Component {
  public name: ComponentType = ComponentType.RENDER;

  public asset: Attribute<AssetKey | Color, TextInput>;

  public size: Attribute<number, NumberInput>;

  public blendMode: Attribute<Phaser.BlendModes, SelectInput<Phaser.BlendModes>>;

  protected maxAmount = 1;

  public constructor(data: RenderComponentData) {
    super();
    this.asset = new Attribute(data.asset, 'Anzeige', TextInput);
    this.size = new Attribute(data.size, 'Größe', NumberInput);
    this.blendMode = new Attribute(data.blendMode || Phaser.BlendModes.NORMAL, 'Blend Mode', SelectInput);
  }
}
