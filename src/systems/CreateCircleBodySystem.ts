import Phaser from 'phaser';
import { pickBy } from 'lodash-es';
import { ComponentType } from '../enums';
import { RectangleBodyComponent } from '../components/RectangleBodyComponent';
import { CreateRectangleBodySystem } from './CreateRectangleBodySystem';

export class CreateCircleBodySystem extends CreateRectangleBodySystem {
  public constructor(scene: Phaser.Scene) {
    super(scene, ComponentType.SOLID_BODY_CIRCLE);
    this.expectedComponents = [ComponentType.SOLID_BODY_CIRCLE];
  }

  // liefert den festen Körper der Entität zurück
  protected getBody(component: RectangleBodyComponent): Phaser.Physics.Matter.Matter.Body {
    const options: Phaser.Physics.Matter.Matter.IBodyDefinition = {
      friction: 0.1,
      frictionAir: 0.3,
      isStatic: component.isStatic.value,
    };
    return Phaser.Physics.Matter.Matter.Bodies.circle(
      0,
      0,
      component.size.value.width,
      pickBy(options, (v) => v !== undefined),
    );
  }
}
