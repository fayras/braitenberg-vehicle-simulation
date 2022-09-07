import Phaser from 'phaser';
import { System } from './System';
import { Entity } from '../Entity';
import { ComponentType } from '../enums';
import EntityManager from '../EntityManager';
import { EntityQuery } from '../EntityQuery';
import { SensorComponent } from '../components/SensorComponent';
import { SourceComponent } from '../components/SourceComponent';

export class ReactionSystem extends System {
  sourceQuery: EntityQuery;

  public constructor(scene: Phaser.Scene) {
    super(scene, [ComponentType.SENSOR]);

    this.sourceQuery = EntityManager.createQuery([ComponentType.SOURCE]);
  }

  public override internalUpdate(entities: ReadonlySet<Entity>): void {
    const sources = this.sourceQuery.entities;
    entities.forEach((sensorEntity) => {
      const sensorTex = sensorEntity.getComponent<SensorComponent>(ComponentType.SENSOR)?.renderableObject.value
        ?.texture;

      if (!sensorTex) {
        return;
      }

      sources.forEach((sourceEntity) => {
        const sourceTex = sourceEntity.getComponent<SourceComponent>(ComponentType.SOURCE)?.renderableObject.value
          ?.texture;
        if (!sourceTex) {
          return;
        }

        this.collide(sensorTex, sourceTex);
      });
    });
  }

  private collide(
    sensorTex: Phaser.Textures.Texture | Phaser.Textures.CanvasTexture,
    sourceTex: Phaser.Textures.Texture | Phaser.Textures.CanvasTexture,
  ): void {
    // sensorTex.frames;
  }
}
