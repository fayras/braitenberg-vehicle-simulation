import ComponentType from './types';

export default class RenderComponent implements Component {
  public name: ComponentType = ComponentType.RENDER;

  public asset: AssetKey;

  public constructor(asset: AssetKey) {
    this.asset = asset;
  }
}
