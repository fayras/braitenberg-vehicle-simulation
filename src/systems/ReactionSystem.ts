import Phaser from 'phaser';
import System from './System';
import { ComponentType, EventType } from '../enums';
import EventBus from '../EventBus';

export default class ReactionSystem extends System {
  public expectedComponents: ComponentType[] = [];

  public constructor(scene: Phaser.Scene) {
    super(scene);

    EventBus.subscribe(EventType.REACTION, ReactionSystem.handleReaction);
  }

  public update(): void {}

  protected onEntityCreated(): void {}

  protected onEntityDestroyed(): void {}

  private static handleReaction(payload: EventMessages.Reaction): void {
    if (payload.other.label === ComponentType.SOURCE) {
      const source = payload.other as SourcePhysicsObject;
      const { sensor } = payload;
      if (!ReactionSystem.reactTogether(sensor, source)) return;

      const distance = Phaser.Physics.Matter.Matter.Vector.sub(sensor.position, source.position);
      const activation = source.userData.kernel(distance.x, distance.y);

      sensor.userData.belongsTo.component.activation = activation;
    }
  }

  private static reactTogether(sensor: SensorPhysicsObject, source: SourcePhysicsObject): boolean {
    return sensor.userData.belongsTo.component.reactsTo === source.userData.belongsTo.component.substance;
  }
}
