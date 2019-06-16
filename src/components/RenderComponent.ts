import { ComponentType } from '../enums';
import Component from './Component';

export default class RenderComponent extends Component {
  public name: ComponentType = ComponentType.RENDER;

  public asset: AssetKey | Color;

  public size: number;

  public blendMode: Phaser.BlendModes | null;

  public constructor(asset: AssetKey | Color, width: number, blendMode: Phaser.BlendModes | null = null) {
    super();
    this.asset = asset;
    this.size = width;
    this.blendMode = blendMode;
  }

  public serializeAttributes(): object {
    return {
      asset: this.asset,
      size: this.size,
      blendMode: this.blendMode,
    };
  }
}
