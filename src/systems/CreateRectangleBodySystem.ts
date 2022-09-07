import Phaser from 'phaser';
import { pickBy } from 'lodash-es';
import { System } from './System';
import { Entity } from '../Entity';
import { ComponentType } from '../enums';
import { RectangleBodyComponent } from '../components/RectangleBodyComponent';

export class CreateRectangleBodySystem extends System {
  protected expectedComponent: ComponentType;

  public constructor(scene: Phaser.Scene, expected = ComponentType.SOLID_BODY_RECT) {
    super(scene, [expected], false);
    this.expectedComponent = expected;
  }

  public override internalUpdate(): void {}

  protected override enter(entity: Entity): void {
    const solidBody = entity.getComponent<RectangleBodyComponent>(this.expectedComponent)!;

    const body = this.getBody(solidBody);

    body.label = entity.id;
    solidBody.physicsBody.value = body;
    this.scene.matter.world.add(body);
  }

  protected override exit(entity: Entity): void {
    const solidBody = entity.getComponent<RectangleBodyComponent>(this.expectedComponent);
    const body = solidBody?.physicsBody.value;

    if (body) {
      this.scene.matter.world.remove(body, true);
      solidBody.physicsBody.value = undefined;
    }
  }

  // liefert den festen Körper der Entität zurück
  protected getBody(component: RectangleBodyComponent): Phaser.Physics.Matter.Matter.Body {
    const options: Phaser.Physics.Matter.Matter.IBodyDefinition = {
      friction: 0.7,
      frictionAir: 0.6,
      isStatic: component.isStatic.value,
    };

    return Phaser.Physics.Matter.Matter.Bodies.rectangle(
      0,
      0,
      component.size.value.width,
      component.size.value.height,
      pickBy(options, (v) => v !== undefined),
    );
  }
}
