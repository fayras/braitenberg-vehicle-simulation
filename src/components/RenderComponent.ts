import Phaser from 'phaser';
import { ComponentType } from '../enums';
import Component from './Component';
import Attribute from './Attribute';
import TextInput from '../dynamic_input/TextInput';
import NumberInput from '../dynamic_input/NumberInput';
import HiddenInput from '../dynamic_input/HiddenInput';

interface RenderComponentData {
  asset: AssetKey | Color;
  size: number;
  blendMode?: Phaser.BlendModes;
}

export default class RenderComponent extends Component {
  public name: ComponentType = ComponentType.RENDER;

  public asset: Attribute<AssetKey | Color, TextInput>;

  public size: Attribute<number, NumberInput>;

  public blendMode: Attribute<Phaser.BlendModes, HiddenInput>;

  protected maxAmount = 1;

  protected deletable: boolean = false;

  protected infoTip: string =
    'Achtung! Diese Komponente bestimmt nur die visuelle Darstellung und ist unabhängig von der Komponente für einen festen Körper.';

  public constructor(data: RenderComponentData) {
    super();
    this.asset = new Attribute(data.asset, 'Anzeige', TextInput);
    this.size = new Attribute(data.size, 'Größe', NumberInput);
    this.blendMode = new Attribute(data.blendMode || Phaser.BlendModes.NORMAL, 'Blend Mode', HiddenInput);
  }
}
