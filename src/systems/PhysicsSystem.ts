import Phaser from 'phaser';
import { pickBy } from 'lodash-es';
import System from './System';
import Entity from '../Entity';
import { ComponentType, BodyShape, EventType } from '../enums';
import SolidBodyComponent from '../components/SolidBodyComponent';
import TransformableComponent from '../components/TransformableComponent';
import EventBus from '../EventBus';

interface PhysicsObjectDictionary {
  [entityId: number]: {
    body: Phaser.Physics.Matter.Matter.Body;
    eventBeforeUpdate: Function;
    eventAfterUpdate: Function;
  };
}

export default class PhysicsSystem extends System {
  public expectedComponents: ComponentType[] = [ComponentType.TRANSFORMABLE, ComponentType.SOLID_BODY];

  private physicsObjects: PhysicsObjectDictionary = {};

  public constructor(scene: Phaser.Scene) {
    super(scene);

    EventBus.subscribe(EventType.APPLY_FORCE, this.applyForce.bind(this));
  }

  public update(): void {}

  protected onEntityCreated(entity: Entity): void {
    const component = entity.getComponent(ComponentType.SOLID_BODY) as SolidBodyComponent;

    const body = PhysicsSystem.getBody(component);

    const emitters = this.attachSynchronization(body, entity);

    this.scene.matter.world.add(body);
    this.physicsObjects[entity.id] = {
      body,
      eventBeforeUpdate: emitters[0],
      eventAfterUpdate: emitters[1],
    };
  }

  protected onEntityDestroyed(entity: Entity): void {
    const { body, eventBeforeUpdate, eventAfterUpdate } = this.physicsObjects[entity.id];

    this.scene.matter.world.off('beforeupdate', eventBeforeUpdate);
    this.scene.matter.world.off('afterupdate', eventAfterUpdate);
    this.scene.matter.world.remove(body, false);
    delete this.physicsObjects[entity.id];
  }

  private static getBody(component: SolidBodyComponent): Phaser.Physics.Matter.Matter.Body {
    switch (component.shape) {
      case BodyShape.CIRCLE: {
        const options: Phaser.Physics.Matter.Matter.IBodyDefinition = {
          friction: 0.1,
          frictionAir: 0.3,
          isStatic: component.isStatic,
        };
        return Phaser.Physics.Matter.Matter.Bodies.circle(0, 0, component.size, pickBy(options, v => v !== undefined));
      }
      case BodyShape.RECTANGLE:
      default: {
        const options: Phaser.Physics.Matter.Matter.IBodyDefinition = {
          friction: 0.7,
          frictionAir: 0.6,
          isStatic: component.isStatic,
        };
        return Phaser.Physics.Matter.Matter.Bodies.rectangle(
          0,
          0,
          component.size,
          component.size,
          pickBy(options, v => v !== undefined),
        );
      }
    }
  }

  private attachSynchronization(body: Phaser.Physics.Matter.Matter.Body, entity: Entity): Function[] {
    const component = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;

    const onBefore = (): void => {
      Phaser.Physics.Matter.Matter.Body.setPosition(body, component.position);
      Phaser.Physics.Matter.Matter.Body.setAngle(body, component.angle);
    };
    this.scene.matter.world.on('beforeupdate', onBefore);

    const onAfter = (): void => {
      component.position.x = body.position.x;
      component.position.y = body.position.y;
      component.angle = body.angle;
    };
    this.scene.matter.world.on('afterupdate', onAfter);

    return [onBefore, onAfter];
  }

  private applyForce(payload: EventMessages.ApplyForce): void {
    const { body } = this.physicsObjects[payload.id];

    if (!body) return;

    const { offset, force } = payload;

    const V = Phaser.Physics.Matter.Matter.Vector;
    const t = V.cross(V.neg(offset), force);

    // Das Drehmoment wird hier manuell berechnet, da `applyForce` nicht selbstständig
    // das Drehmoment berechnet. Die Formel stimmt nicht mit der Realität überein,
    // fühlt sich in der Simulation besser an, da das Vehikel schneller zur bzw.
    // weg von der Quelle dreht.
    // Die Potenz sorgt dafür, dass kleinere Drehungen mehr Drehmoment erzeugen und das
    // Vehikel sich dadurch eher dreht. Es ist wichtig eine ungerade Potenz zu nehmen,
    // damit entgegengesetztes Drehmoment die Rotatioin ausgleicht.
    body.torque -= (t + Math.sign(t)) ** 3;

    // console.log(body.torque, t);

    Phaser.Physics.Matter.Matter.Body.applyForce(
      body,
      { x: body.position.x + offset.x, y: body.position.y + offset.y },
      force,
    );
  }
}
