import Phaser from 'phaser';
import { System } from './System';
import { Entity, EntityID } from '../Entity';
import { ComponentType } from '../enums';
import { RectangleBodyComponent } from '../components/RectangleBodyComponent';
import { TransformableComponent } from '../components/TransformableComponent';
import { CircleBodyComponent } from '../components/CircleBodyComponent';

export class PhysicsSystem extends System {
  private disposers: Map<EntityID, IDisposable[]> = new Map();

  public constructor(scene: Phaser.Scene) {
    // eslint-disable-next-line no-bitwise
    super(scene, [ComponentType.TRANSFORMABLE, ComponentType.SOLID_BODY_RECT | ComponentType.SOLID_BODY_CIRCLE]);
  }

  public override internalUpdate(): void {}

  protected override enter(entity: Entity): void {
    const updateTransform = (): IDisposable => {
      const transform = entity.getComponent<TransformableComponent>(
        ComponentType.TRANSFORMABLE,
      ) as TransformableComponent;
      const solidBody: RectangleBodyComponent | CircleBodyComponent | undefined =
        entity.getComponent<RectangleBodyComponent>(ComponentType.SOLID_BODY_RECT) ||
        entity.getComponent<CircleBodyComponent>(ComponentType.SOLID_BODY_CIRCLE);

      const onBefore = (): void => {
        const body = solidBody?.physicsBody.value;
        if (body) {
          Phaser.Physics.Matter.Matter.Body.setPosition(body, transform.position.value);
          Phaser.Physics.Matter.Matter.Body.setAngle(body, transform.angle.value);
        }
      };
      this.scene.matter.world.on('beforeupdate', onBefore);

      const onAfter = (): void => {
        const body = solidBody?.physicsBody.value;
        if (body) {
          transform.position.value = body.position;
          transform.angle.value = body.angle;
        }
      };
      this.scene.matter.world.on('afterupdate', onAfter);

      return () => {
        this.scene.matter.world.off('beforeupdate', onBefore);
        this.scene.matter.world.off('afterupdate', onAfter);
      };
    };

    this.disposers.set(entity.id, [updateTransform()]);
  }

  protected override exit(entity: Entity): void {
    this.disposers.get(entity.id)?.forEach((disposer) => disposer());
  }
}
