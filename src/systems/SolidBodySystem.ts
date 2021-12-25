import Phaser from 'phaser';
import { pickBy } from 'lodash-es';
import { autorun, reaction } from 'mobx';
import System from './System';
import { EntityID, Entity } from '../Entity';
import { ComponentType, BodyShape } from '../enums';
import SolidBodyComponent from '../components/SolidBodyComponent';
import TransformableComponent from '../components/TransformableComponent';

export class SolidBodySystem extends System {
  private disposers: Map<EntityID, IDisposable[]> = new Map();

  private bodiesGraphic: Phaser.GameObjects.Graphics;

  public constructor(scene: Phaser.Scene) {
    super(scene, [ComponentType.SOLID_BODY], false);

    this.bodiesGraphic = this.scene.sys.add.graphics({ x: 0, y: 0 });
    this.bodiesGraphic.setDepth(Number.MAX_VALUE);
  }

  public override internalUpdate(entities: Set<Entity>, delta: number): void {
    this.bodiesGraphic.clear();
    const bodyColor = 0x999999;

    entities.forEach((entity) => {
      const body = entity.getComponent<SolidBodyComponent>(ComponentType.SOLID_BODY)!.physicsBody;

      if (body) {
        this.scene.matter.world.renderBody(body as MatterJS.BodyType, this.bodiesGraphic, true, bodyColor, 1, 1);
      }
    });
  }

  protected override enter(entity: Entity) {
    const solidBody = entity.getComponent<SolidBodyComponent>(ComponentType.SOLID_BODY)!;

    this.createBody(entity);

    const recreateBody = () => {
      this.cleanUp(entity);
      this.createBody(entity);
    };

    const updateSize = (value: Dimensions, old: Dimensions) => {
      const body = solidBody.physicsBody;
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

    const updateStatic = () => {
      const body = solidBody.physicsBody;
      if (body) {
        body.isStatic = solidBody.isStatic.value;
      }
    };

    this.disposers.set(entity.id, [
      reaction(() => solidBody.shape.value, recreateBody),
      reaction(() => solidBody.size.value, updateSize),
      autorun(updateStatic),
    ]);
  }

  protected override exit(entity: Entity) {
    this.cleanUp(entity);
    this.disposers.get(entity.id)?.forEach((disposer) => disposer());
  }

  private cleanUp(entity: Entity) {
    const solidBody = entity.getComponent<SolidBodyComponent>(ComponentType.SOLID_BODY)!;
    const body = solidBody.physicsBody;

    if (body) {
      this.scene.matter.world.remove(body, true);
      solidBody.physicsBody = undefined;
    }
  }

  private createBody(entity: Entity): void {
    console.log('createBody');
    const solidBody = entity.getComponent<SolidBodyComponent>(ComponentType.SOLID_BODY)!;
    if (solidBody.physicsBody) {
      return;
    }

    const body = SolidBodySystem.getBody(solidBody);

    body.label = entity.id;
    solidBody.physicsBody = body;
    this.scene.matter.world.add(body);
  }

  // liefert den festen Körper der Entität zurück
  private static getBody(component: SolidBodyComponent): Phaser.Physics.Matter.Matter.Body {
    switch (component.shape.value) {
      case BodyShape.CIRCLE: {
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
      case BodyShape.RECTANGLE:
      default: {
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
  }
}
