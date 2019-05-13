import Phaser from 'phaser';
import System from './System';
import Entity from '../Entity';
import { ComponentType, BodyShape, EventType } from '../enums';
import SolidBodyComponent from '../components/SolidBodyComponent';
import TransformableComponent from '../components/TransformableComponent';
import EventBus from '../EventBus';

interface PhysicsObjectDictionary {
  [entityId: number]: Phaser.Physics.Matter.Matter.Body;
}

export default class PhysicsSystem extends System {
  public expectedComponents: ComponentType[] = [ComponentType.TRANSFORMABLE, ComponentType.SOLID_BODY];

  private physicsObjects: PhysicsObjectDictionary = {};

  public constructor(scene: Phaser.Scene, bus: EventBus) {
    super(scene, bus);

    this.eventBus.subscribe(EventType.APPLY_FORCE, this.applyForce.bind(this));
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
          friction: 0.1,
          frictionAir: 0.3,
        });
      case BodyShape.RECTANGLE:
      default:
        return Phaser.Physics.Matter.Matter.Bodies.rectangle(0, 0, component.size, component.size, {
          friction: 0.7,
          frictionAir: 0.6,
        });
    }
  }

  private attachSynchronization(body: Phaser.Physics.Matter.Matter.Body, entity: Entity): void {
    const component = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;

    this.scene.matter.world.on('beforeupdate', () => {
      Phaser.Physics.Matter.Matter.Body.setPosition(body, component.position);
      Phaser.Physics.Matter.Matter.Body.setAngle(body, component.angle);
    });

    this.scene.matter.world.on('afterupdate', () => {
      component.position.x = body.position.x;
      component.position.y = body.position.y;
      component.angle = body.angle;
    });
  }

  private applyForce(payload: EventMessages.ApplyForce): void {
    const body = this.physicsObjects[payload.id];

    if (!body) return;

    const { offset, force } = payload;

    Phaser.Physics.Matter.Matter.Body.applyForce(
      body,
      { x: body.position.x + offset.x, y: body.position.y + offset.y },
      force,
    );
  }
}
