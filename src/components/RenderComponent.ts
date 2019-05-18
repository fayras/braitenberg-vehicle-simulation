import { ComponentType } from '../enums';

export default class RenderComponent extends Comment {
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
