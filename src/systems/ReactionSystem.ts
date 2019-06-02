import Phaser from 'phaser';
import System from './System';
import Entity from '../Entity';
import { ComponentType, EventType } from '../enums';
import EventBus from '../EventBus';

export default class ReactionSystem extends System {
  public expectedComponents: ComponentType[] = [];

  public constructor(scene: Phaser.Scene) {
    super(scene);

    EventBus.subscribe(EventType.REACTION, ReactionSystem.handleReaction);
  }

  public update(): void {}

  protected onEntityCreated(entity: Entity): void {}

  protected onEntityDestroyed(entity: Entity): void {}

  private static handleReaction(payload: EventMessages.Reaction): void {
    if (payload.other.label === ComponentType.SOURCE) {
      const source = payload.other as SourcePhysicsObject;
      if (!ReactionSystem.reactTogether(payload.sensor, source)) return;

      console.log(payload.sensor, source);
    }
  }

  private static reactTogether(sensor: SensorPhysicsObject, source: SourcePhysicsObject): boolean {
    return sensor.userData.belongsTo.component.reactsTo === source.userData.belongsTo.component.substance;
  }
}
