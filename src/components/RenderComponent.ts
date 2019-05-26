import { ComponentType } from '../enums';
import Component from './Component';

export default class RenderComponent extends Component {
  public name: ComponentType = ComponentType.RENDER;

  public asset: AssetKey;

  public size: number;

  public blendMode: Phaser.BlendModes | null;

  public constructor(asset: AssetKey, width: number, blendMode: Phaser.BlendModes | null = null) {
    super();
    this.asset = asset;
    this.size = width;
    this.blendMode = blendMode;
  }
}
