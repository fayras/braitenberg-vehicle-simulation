import Phaser from 'phaser';
import { pickBy } from 'lodash-es';
import System from './System';
import Entity, { EntityID } from '../Entity';
import { ComponentType, BodyShape } from '../enums';
import SolidBodyComponent from '../components/SolidBodyComponent';
import TransformableComponent from '../components/TransformableComponent';
import { autorun, reaction } from 'mobx';

export class PhysicsBodySystem extends System {
  private disposers: Map<EntityID, IDisposable[]> = new Map();

  public constructor(scene: Phaser.Scene) {
    super(scene, [ComponentType.TRANSFORMABLE, ComponentType.SOLID_BODY]);
  }

  public override internalUpdate(entities: Set<Entity>, delta: number): void {}

  protected override enter(entity: Entity) {
    const updateTransform = () => {
      const transform = entity.getComponent<TransformableComponent>(ComponentType.TRANSFORMABLE)!;
      const solidBody = entity.getComponent<SolidBodyComponent>(ComponentType.SOLID_BODY)!;

      const onBefore = (): void => {
        const body = solidBody.physicsBody;
        if (body) {
          Phaser.Physics.Matter.Matter.Body.setPosition(body, transform.position.value);
          Phaser.Physics.Matter.Matter.Body.setAngle(body, transform.angle.value);
        }
      };
      this.scene.matter.world.on('beforeupdate', onBefore);

      const onAfter = (): void => {
        const body = solidBody.physicsBody;
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

  protected override exit(entity: Entity) {
    this.disposers.get(entity.id)?.forEach((disposer) => disposer());
  }
}
