import Phaser from 'phaser';
import { autorun, reaction } from 'mobx';
import { System } from './System';
import { Entity, EntityID } from '../Entity';
import { ComponentType } from '../enums';
import { RectangleBodyComponent } from '../components/RectangleBodyComponent';
import { CircleBodyComponent } from '../components/CircleBodyComponent';

export class SolidBodySystem extends System {
  private readonly bodiesGraphic: Phaser.GameObjects.Graphics;

  private disposers: Map<EntityID, IDisposable[]> = new Map();

  public constructor(scene: Phaser.Scene) {
    // eslint-disable-next-line no-bitwise
    super(scene, [ComponentType.SOLID_BODY_RECT | ComponentType.SOLID_BODY_CIRCLE], false);

    this.bodiesGraphic = this.scene.sys.add.graphics({ x: 0, y: 0 });
    this.bodiesGraphic.setDepth(Number.MAX_VALUE);
  }

  public override internalUpdate(entities: Set<Entity>): void {
    this.bodiesGraphic.clear();
    const bodyColor = 0x999999;

    entities.forEach((entity) => {
      const solidBody =
        entity.getComponent<RectangleBodyComponent>(ComponentType.SOLID_BODY_RECT) ||
        entity.getComponent<CircleBodyComponent>(ComponentType.SOLID_BODY_CIRCLE);

      const body = solidBody?.physicsBody.value;
      if (body) {
        this.scene.matter.world.renderBody(body as MatterJS.BodyType, this.bodiesGraphic, true, bodyColor, 1, 1);
      }
    });
  }

  protected override enter(entity: Entity): void {
    const solidBody =
      entity.getComponent<RectangleBodyComponent>(ComponentType.SOLID_BODY_RECT) ||
      entity.getComponent<CircleBodyComponent>(ComponentType.SOLID_BODY_CIRCLE);

    const updateSize = (value: Dimensions, old: Dimensions): void => {
      const body = solidBody?.physicsBody.value;
      if (body) {
        // Hier wird der Körper einmal in die "aufrechte" Position gedreht, weil `Matter.Body.scale`
        // den Körper aus der "globalen" Sicht skaliert. D.h. sind scaleX und scaleY unterschied-
        // lich, dann wird der Körper gequetscht und zu einem Parallelogramm.
        Phaser.Physics.Matter.Matter.Body.rotate(body, -body.angle);
        Phaser.Physics.Matter.Matter.Body.scale(body, value.width / old.width, value.height / old.height);
        // Da wir den Körper vorher gedreht haben, muss er auch wieder in die Ausgangsdrehung
        // gebracht werden.
        Phaser.Physics.Matter.Matter.Body.rotate(body, body.angle);
      }
    };

    const updateStatic = (): void => {
      const body = solidBody?.physicsBody.value;
      if (body) {
        body.isStatic = solidBody.isStatic.value;
      }
    };

    this.disposers.set(entity.id, [reaction(() => solidBody!.size.value, updateSize), autorun(updateStatic)]);
  }

  protected override exit(entity: Entity): void {
    this.disposers.get(entity.id)?.forEach((disposer) => disposer());
  }
}
