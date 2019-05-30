import Phaser from 'phaser';
import System from './System';
import Entity from '../Entity';
import { ComponentType, EventType } from '../enums';
import EventBus from '../EventBus';

export default class ReactionSystem extends System {
  public expectedComponents: ComponentType[] = [];

  public constructor(scene: Phaser.Scene, bus: EventBus) {
    super(scene, bus);

    this.eventBus.subscribe(EventType.REACTION, ReactionSystem.handleReaction);
  }

  // eslint-disable-next-line
  public update(entities: Entity[]): void {}

  private static handleReaction(payload: EventMessages.Reaction): void {
    if (payload.other.label === ComponentType.SOURCE) {
      const other = payload.other as SourcePhysicsObject;
    }
  }
}
