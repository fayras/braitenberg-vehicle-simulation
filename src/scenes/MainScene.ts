import Phaser from 'phaser';
import EditorScene from './EditorScene';
import SettingScene from './SettingScene';

import SolidBodyComponent from '../components/SolidBodyComponent';
import RenderComponent from '../components/RenderComponent';
import MotorComponent from '../components/MotorComponent';
import SensorComponent from '../components/SensorComponent';
import SourceComponent from '../components/SourceComponent';
import TransformableComponent from '../components/TransformableComponent';

import Entity from '../Entity';

import EventBus from '../EventBus';
import System from '../systems/System';
import PhysicsSystem from '../systems/PhysicsSystem';
import RenderSystem from '../systems/RenderSystem';
import EngineSystem from '../systems/EngineSystem';
import SensorSystem from '../systems/SensorSystem';

import ConnectionComponent from '../components/ConnectionComponent';
import ConnectionSystem from '../systems/ConnectionSystem';
import SourceSystem from '../systems/SourceSystem';
import { SubstanceType, EventType, BodyShape } from '../enums';
import ReactionSystem from '../systems/ReactionSystem';
import EntityManager from '../EntityManager';

export default class MainScene extends Phaser.Scene {
  private systems: System[] = [];

  private renderSystem: RenderSystem;

  private running: boolean = true;

  public constructor() {
    super({ key: 'MainScene' });
    // RenderSystem ist ein bisschen besonders, da es immer laufen sollte, auch
    // wenn die Simulation z.b. pausiert ist.
    this.renderSystem = new RenderSystem(this);
  }

  public create(): void {
    this.createSystems();
    this.scene.launch('MainInterfaceScene');

    this.scale.on('resize', this.handleResize.bind(this));

    this.matter.world.setBounds();

    this.scene.add('editor', EditorScene, false);
    this.scene.add('settings', SettingScene, false);

    EventBus.subscribe(EventType.ENTITY_SELECTED, (entity: Entity) => {
      this.scene.launch('SettingScene', entity);
    });

    for (let i = 0; i < 1; i += 1) {
      EntityManager.createEntity(
        new TransformableComponent({ x: 300, y: 100 }),
        new SolidBodyComponent(100, BodyShape.RECTANGLE, true),
        new RenderComponent('logo', 110),
      );
      // entity.addComponent(new SourceComponent(150));
    }

    const entity = new Entity();
    entity.addComponent(new TransformableComponent({ x: 300, y: 200 }));
    entity.addComponent(new SolidBodyComponent(100));
    entity.addComponent(new RenderComponent('tank', 100));
    const motor1 = entity.addComponent(new MotorComponent({ x: -50, y: 0 }, 20, 2));
    const motor2 = entity.addComponent(new MotorComponent({ x: 50, y: 0 }, 20, 2));
    const sensor1 = entity.addComponent(new SensorComponent({ x: 0, y: 55 }, 80, 0.4));
    // const sensor2 = entity.addComponent(new SensorComponent({ x: 40, y: 55 }, 80, 1.3));
    entity.addComponent(new ConnectionComponent([sensor1], [motor1, motor2], [[0, 1]]));
    EntityManager.addExistingEntity(entity);

    EntityManager.createEntity(
      new TransformableComponent({ x: 500, y: 300 }),
      new RenderComponent('source', 300, Phaser.BlendModes.ADD),
      new SourceComponent(300),
    );

    // EntityManager.createEntity(
    //   new TransformableComponent({ x: 200, y: 400 }),
    //   new RenderComponent('source', 150, Phaser.BlendModes.ADD),
    //   new SourceComponent(150, SubstanceType.BARRIER),
    // );
  }

  private createSystems(): void {
    this.systems = [
      new PhysicsSystem(this),
      new SourceSystem(this),
      new EngineSystem(this),
      new SensorSystem(this),
      new ConnectionSystem(this),
      new ReactionSystem(this),
    ];
  }

  public update(time: number, delta: number): void {
    if (this.running) {
      this.systems.forEach(s => s.update(delta));
    }

    this.renderSystem.update();
  }

  public isRunning(): boolean {
    return this.running;
  }

  public pause(flag: boolean): void {
    this.running = flag;
    // Wenn die Szene gestartet wird (play), wird ein neuer Snapshot erzeugt.
    if (flag) {
      MainScene.createSnapshot();
    }
  }

  // Speicherung des aktuellen Status von allen Entitäten
  public static createSnapshot(): void {
    const entities = EntityManager.getEntities();
    const snapshot = entities.map(entity => entity.serialize());

    localStorage.setItem('snapshot', JSON.stringify(snapshot));
  }

  public static loadSnapshot(): void {
    const entities = EntityManager.getEntities();

    const snapshot = localStorage.getItem('snapshot');

    let aktuellerStatus;
    if (snapshot) {
      aktuellerStatus = JSON.parse(snapshot) as SerializedEntity[];
      entities.forEach(entity => EntityManager.destroyEntity(entity.id));
      EntityManager.loadEntities(aktuellerStatus);
    } else {
      alert('Es konnte keine Scene geladen werden! Bitte verwenden Sie zunächst den Start/Stop Knopf.');
    }
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    const { width, height } = gameSize;

    this.cameras.resize(width, height);
    this.matter.world.setBounds();
  }
}
