import { ComponentType } from '../enums';
import { Component } from './Component';
import { RenderableAttribute } from './attributes/RenderableAttribute';
import { VolatileAttribute } from './attributes/VolatileAttribute';
import { CheckboxInput } from '../gui/Inputs/CheckboxInput';
import { SizeInput } from '../gui/Inputs/SizeInput';

interface SolidBodyComponentData {
  size?: Dimensions;
  isStatic?: boolean;
}

export class RectangleBodyComponent extends Component {
  public label = 'Fester Körper';

  public type: ComponentType = ComponentType.SOLID_BODY_RECT;

  public size: RenderableAttribute<Dimensions, typeof SizeInput>;

  public isStatic: RenderableAttribute<boolean, typeof CheckboxInput>;

  public physicsBody: VolatileAttribute<Phaser.Physics.Matter.Matter.Body>;

  public constructor(data: SolidBodyComponentData) {
    super();

    this.size = new RenderableAttribute(data.size || { width: 50, height: 50 }, SizeInput, {
      label: 'Größe',
      /* min: 20,
        max: 500, */
    });

    this.isStatic = new RenderableAttribute(data.isStatic || false, CheckboxInput, { label: 'Statisch' });

    this.physicsBody = new VolatileAttribute();
  }
}
