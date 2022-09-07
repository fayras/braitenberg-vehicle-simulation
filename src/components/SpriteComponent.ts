import Phaser from 'phaser';
import { ComponentType } from '../enums';
import { ECSComponent } from './ECSComponent';
import { RenderableAttribute } from './attributes/RenderableAttribute';
import { SelectInput } from '../gui/Inputs/SelectInput';
import { SizeInput } from '../gui/Inputs/SizeInput';
import { AssetKey, LoadingScene } from '../scenes/LoadingScene';
import { VolatileAttribute } from './attributes/VolatileAttribute';

interface RenderComponentData {
  asset: AssetKey;
  size: Dimensions;
  blendMode?: Phaser.BlendModes;
}

export type Renderable = Phaser.GameObjects.Image;

export class SpriteComponent extends ECSComponent {
  public label = 'Anzeige';

  public type: ComponentType = ComponentType.RENDER;

  public asset: RenderableAttribute<RenderComponentData['asset'], typeof SelectInput>;

  public size: RenderableAttribute<Dimensions, typeof SizeInput>;

  public blendMode: RenderableAttribute<Phaser.BlendModes, null>;

  public renderableObject: VolatileAttribute<Renderable>;

  protected deletable = false;

  protected infoTip =
    'Achtung! Diese Komponente bestimmt nur die visuelle Darstellung und ist unabhängig von der Komponente für einen festen Körper.';

  public constructor(data: RenderComponentData) {
    super();
    this.asset = new RenderableAttribute(data.asset, SelectInput, {
      label: 'Anzeige',
      options: {
        ...LoadingScene.userOptions(),
      },
    });

    this.blendMode = new RenderableAttribute(data.blendMode || Phaser.BlendModes.NORMAL);

    this.size = new RenderableAttribute(data.size || { width: 50, height: 50 }, SizeInput, {
      label: 'Größe',
    });

    this.renderableObject = new VolatileAttribute();
  }
}
