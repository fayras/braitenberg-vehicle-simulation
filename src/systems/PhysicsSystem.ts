import Phaser from 'phaser';
import Entity from '../Entity';
import { ComponentType, BodyShape } from '../enums';
import SolidBodyComponent from '../components/SolidBodyComponent';

interface PhysicsObjectDictionary {
  [entityId: number]: Phaser.Physics.Matter.Matter.Body;
}

export default class PhysicsSystem implements System {
  public expectedComponents: ComponentType[] = [ComponentType.SOLID_BODY];

  private scene: Phaser.Scene;

  private physicsObjects: PhysicsObjectDictionary = {};

  public constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public update(entities: Entity[]): void {
    entities.forEach(entity => {
      if (!this.physicsObjects[entity.id]) {
        this.addEntity(entity);
      }
    });
  }

  private addEntity(entity: Entity): void {
    const component = entity.getComponent(ComponentType.SOLID_BODY) as SolidBodyComponent;

    const body = PhysicsSystem.getBody(component);

    this.scene.matter.world.add(body);
    this.physicsObjects[entity.id] = body;
  }

  private static getBody(component: SolidBodyComponent): Phaser.Physics.Matter.Matter.Body {
    switch (component.shape) {
      case BodyShape.CIRCLE:
        return Phaser.Physics.Matter.Matter.Bodies.circle(0, 0, component.size, {
          friction: 0.005,
          frictionAir: 0.1,
        });
      case BodyShape.RECTANGLE:
      default:
        return Phaser.Physics.Matter.Matter.Bodies.rectangle(0, 0, component.size, component.size, {
          friction: 0.005,
          frictionAir: 0.1,
        });
    }
  }
}
