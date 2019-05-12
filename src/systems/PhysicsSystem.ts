import Phaser from 'phaser';
import Entity from '../Entity';
import { ComponentType, BodyShape } from '../enums';
import SolidBodyComponent from '../components/SolidBodyComponent';
import TransformableComponent from '../components/TransformableComponent';

interface PhysicsObjectDictionary {
  [entityId: number]: Phaser.Physics.Matter.Matter.Body;
}

export default class PhysicsSystem implements System {
  public expectedComponents: ComponentType[] = [ComponentType.TRANSFORMABLE, ComponentType.SOLID_BODY];

  private scene: Phaser.Scene;

  private physicsObjects: PhysicsObjectDictionary = {};

  public constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public update(entities: Entity[]): void {
    entities.forEach(entity => {
      if (!this.physicsObjects[entity.id]) this.addEntity(entity);
    });
  }

  private addEntity(entity: Entity): void {
    const component = entity.getComponent(ComponentType.SOLID_BODY) as SolidBodyComponent;

    const body = PhysicsSystem.getBody(component);

    this.attachSynchronization(body, entity);

    this.scene.matter.world.add(body);
    this.physicsObjects[entity.id] = body;
  }

  private static getBody(component: SolidBodyComponent): Phaser.Physics.Matter.Matter.Body {
    switch (component.shape) {
      case BodyShape.CIRCLE:
        return Phaser.Physics.Matter.Matter.Bodies.circle(0, 0, component.size, {
          friction: 0.5,
          frictionAir: 0.1,
        });
      case BodyShape.RECTANGLE:
      default:
        return Phaser.Physics.Matter.Matter.Bodies.rectangle(0, 0, component.size, component.size, {
          friction: 0.5,
          frictionAir: 0.1,
        });
    }
  }

  private attachSynchronization(body: Phaser.Physics.Matter.Matter.Body, entity: Entity): void {
    const component = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;

    this.scene.matter.world.on(
      'beforeupdate',
      (): void => {
        Phaser.Physics.Matter.Matter.Body.setPosition(body, component.position);
        Phaser.Physics.Matter.Matter.Body.setAngle(body, component.angle);
      },
    );

    this.scene.matter.world.on(
      'afterupdate',
      (): void => {
        component.position.x = body.position.x;
        component.position.y = body.position.y;
        component.angle = body.angle;
      },
    );
  }
}
