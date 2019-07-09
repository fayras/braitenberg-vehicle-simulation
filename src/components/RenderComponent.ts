import Phaser from 'phaser';
import { ComponentType } from '../enums';
import Component from './Component';
import Attribute from './Attribute';
import TextInput from '../dynamic_input/TextInput';
import NumberInput from '../dynamic_input/NumberInput';
import SelectInput from '../dynamic_input/SelectInput';

export default class RenderComponent extends Component {
  public name: ComponentType = ComponentType.RENDER;

  public asset: Attribute<AssetKey | Color, TextInput>;

  public size: Attribute<number, NumberInput>;

  public blendMode: Attribute<Phaser.BlendModes, SelectInput<Phaser.BlendModes>>;

  protected maxAmount = 1;

  public constructor(asset: AssetKey | Color, width: number, blendMode: Phaser.BlendModes = Phaser.BlendModes.NORMAL) {
    super();
    this.asset = new Attribute(asset, 'Anzeige', TextInput);
    this.size = new Attribute(width, 'Größe', NumberInput);
    this.blendMode = new Attribute(blendMode, 'Blend Mode', SelectInput);
  }

  public serializeAttributes(): object {
    return {
      asset: this.asset.get(),
      size: this.size.get(),
      blendMode: this.blendMode.get(),
    };
  }
}
