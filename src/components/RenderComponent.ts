import Phaser from 'phaser';
import { ComponentType } from '../enums';
import Component from './Component';
import Attribute from './Attribute';
import TextInput from '../dynamic_input/TextInput';
import NumberInput from '../dynamic_input/NumberInput';
import HiddenInput from '../dynamic_input/HiddenInput';
import SelectInput from '../dynamic_input/SelectInput';
import LoadingScene from '../scenes/LoadingScene';

interface RenderComponentData {
  asset: AssetKey | Color;
  size: number;
  blendMode?: Phaser.BlendModes;
}

export default class RenderComponent extends Component {
  public name: ComponentType = ComponentType.RENDER;

  public asset: Attribute<AssetKey | Color, SelectInput<any>>;

  public size: Attribute<number, NumberInput>;

  public blendMode: Attribute<Phaser.BlendModes, HiddenInput>;

  protected maxAmount = 1;

  protected deletable: boolean = false;

  protected infoTip: string =
    'Achtung! Diese Komponente bestimmt nur die visuelle Darstellung und ist unabhängig von der Komponente für einen festen Körper.';

  public constructor(data: RenderComponentData) {
    super();
    this.asset = new Attribute(
      data.asset,
      SelectInput.create<any, SelectInput<any>>({
        label: 'Anzeige',
        options: {
          ...LoadingScene.userOptions(),
          'Farbe: Grau': 0xcccccc,
          'Farbe: Rot': 0xd14152,
          'Farbe: Grün': 0x57a639,
          'Farbe: Blau': 0x1b5583,
        },
      }),
    );
    this.size = new Attribute(data.size, NumberInput.create({ label: 'Größe' }));
    this.blendMode = new Attribute(data.blendMode || Phaser.BlendModes.NORMAL, HiddenInput.create());
  }
}
