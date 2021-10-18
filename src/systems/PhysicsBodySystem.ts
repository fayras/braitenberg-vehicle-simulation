import Phaser from 'phaser';
import { pickBy } from 'lodash-es';
import System from './System';
import Entity, { EntityID } from '../Entity';
import { ComponentType, BodyShape } from '../enums';
import SolidBodyComponent from '../components/SolidBodyComponent';
import TransformableComponent from '../components/TransformableComponent';
import { autorun, reaction } from 'mobx';

export class PhysicsBodySystem extends System {
  private bodies: Map<EntityID, Phaser.Physics.Matter.Matter.Body> = new Map();
  private disposers: Map<EntityID, IDisposable[]> = new Map();

  private bodiesGraphic: Phaser.GameObjects.Graphics;

  public constructor(scene: Phaser.Scene) {
    super(scene, [ComponentType.TRANSFORMABLE, ComponentType.SOLID_BODY]);

    this.bodiesGraphic = this.scene.sys.add.graphics({ x: 0, y: 0 });
    this.bodiesGraphic.setDepth(Number.MAX_VALUE);

    this.query.onEntityAdded((entity) => {
      const transform = entity.getComponent<TransformableComponent>(ComponentType.TRANSFORMABLE)!;
      const solidBody = entity.getComponent<SolidBodyComponent>(ComponentType.SOLID_BODY)!;

      this.createBody(entity);

      const recreateBody = () => {
        this.cleanUp(entity);
        this.createBody(entity);
      };

      const updateTransform = () => {
        const body = this.bodies.get(entity.id)!;

        const onBefore = (): void => {
          Phaser.Physics.Matter.Matter.Body.setPosition(body, transform.position.value);
          Phaser.Physics.Matter.Matter.Body.setAngle(body, transform.angle.value);
        };
        this.scene.matter.world.on('beforeupdate', onBefore);

        const onAfter = (): void => {
          transform.position.value = body.position;
          transform.angle.value = body.angle;
        };
        this.scene.matter.world.on('afterupdate', onAfter);

        return () => {
          this.scene.matter.world.off('beforeupdate', onBefore);
          this.scene.matter.world.off('afterupdate', onAfter);
        };
      };

      const updateSize = (value: Dimensions, old: Dimensions) => {
        const body = this.bodies.get(entity.id);
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
        const body = this.bodies.get(entity.id);
        if (body) {
          body.isStatic = solidBody.isStatic.value;
        }
      };

      this.disposers.set(entity.id, [
        updateTransform(),
        reaction(() => solidBody.shape.value, recreateBody),
        reaction(() => solidBody.size.value, updateSize),
        autorun(updateStatic),
      ]);
    });

    this.query.onEntityRemoved((entity) => {
      this.cleanUp(entity);
      this.renderBodies();
      this.disposers.get(entity.id)?.forEach((disposer) => disposer());
    });
  }

  public override internalUpdate(entities: Set<Entity>, delta: number): void {
    this.renderBodies();
  }

  private renderBodies() {
    this.bodiesGraphic.clear();
    const bodyColor = 0x999999;

    this.bodies.forEach((body) => {
      this.scene.matter.world.renderBody(body as MatterJS.BodyType, this.bodiesGraphic, true, bodyColor, 1, 1);
    });
  }

  private cleanUp(entity: Entity) {
    const body = this.bodies.get(entity.id);

    if (body) {
      this.scene.matter.world.remove(body, true);
      this.bodies.delete(entity.id);
    }
  }

  private createBody(entity: Entity): void {
    if (this.bodies.has(entity.id)) {
      return;
    }

    const solidBody = entity.getComponent<SolidBodyComponent>(ComponentType.SOLID_BODY)!;
    const body = PhysicsBodySystem.getBody(solidBody);

    body.label = entity.id;
    this.scene.matter.world.add(body);
    this.bodies.set(entity.id, body);
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
