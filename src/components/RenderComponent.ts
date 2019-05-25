import { ComponentType } from '../enums';
import Component from './Component';

export default class RenderComponent extends Component {
  public name: ComponentType = ComponentType.RENDER;

  public asset: AssetKey;

  public width: number;

  public height: number | null;

  public constructor(asset: AssetKey, width: number, height: number | null = null) {
    super();
    this.asset = asset;
    this.width = width;
    this.height = height;
  }
}
