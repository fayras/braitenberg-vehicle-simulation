import Phaser from 'phaser';

import SolidBodyComponent from '../components/SolidBodyComponent';
import RenderComponent from '../components/RenderComponent';
import MotorComponent from '../components/MotorComponent';
import SensorComponent from '../components/SensorComponent';
import SourceComponent from '../components/SourceComponent';
import TransformableComponent from '../components/TransformableComponent';
import ConnectionComponent from '../components/ConnectionComponent';

import { Entity } from '../Entity';

import System from '../systems/System';
import { RenderSystem } from '../systems/RenderSystem';
import { PhysicsBodySystem } from '../systems/PhysicsBodySystem';

import { SubstanceType, BodyShape, EmissionType } from '../enums';
import EntityManager from '../EntityManager';

import { store as mainNavigationStore } from '../gui/_store/mainNavigation';
import { reaction } from 'mobx';
import { SolidBodySystem } from '../systems/SolidBodySystem';
import { MovementSystem } from '../systems/MovementSystem';

export default class MainScene extends Phaser.Scene {
  private systems: System[] = [];

  private running: boolean = false;

  private fpsText?: Phaser.GameObjects.Text;

  public constructor() {
    super({ key: 'MainScene' });
  }

  public create(): void {
    this.createSystems();
    // @ts-ignore
    window.em = EntityManager;
    // @ts-ignore
    window.scene = this;

    this.fpsText = this.add.text(10, 100, 'FPS: --', {
      font: 'bold 26px Arial',
    });

    // Anpassen der Szene an aktuelle Bildschirmgröße
    this.scale.on('resize', this.handleResize.bind(this));
    this.matter.world.setBounds();

    // playState.watch((state) => this.pause(state));
    this.pause(mainNavigationStore.playState);
    reaction(
      () => mainNavigationStore.playState,
      (playstate) => {
        this.pause(playstate);
      },
    );

    EntityManager.createEntity(
      new TransformableComponent({ position: { x: 600, y: 450 } }),
      new SolidBodyComponent({
        size: { width: 20, height: 400 },
        shape: BodyShape.RECTANGLE,
        isStatic: true,
      }),
      new SourceComponent({
        range: 100,
        substance: SubstanceType.BARRIER,
        emissionType: EmissionType.FLAT,
      }),
      new RenderComponent({
        asset: 0xcccccc,
        size: 110,
      }),
    );

    const entity = new Entity();
    const transform = new TransformableComponent({
      position: { x: 100, y: 500 },
    });
    transform.angle.value = -Math.PI / 2;
    entity.addComponent(transform);
    entity.addComponent(
      new SolidBodyComponent({
        size: { width: 100, height: 150 },
      }),
    );
    entity.addComponent(
      new RenderComponent({
        asset: 'vehicle',
        size: 100,
      }),
    );
    const motor1 = entity.addComponent(
      new MotorComponent({
        position: { x: -50, y: 0 },
        maxSpeed: 30,
        defaultSpeed: 1,
      }),
    );
    const motor2 = entity.addComponent(
      new MotorComponent({
        position: { x: 50, y: 0 },
        maxSpeed: 30,
        defaultSpeed: 1,
      }),
    );
    const sensor1 = entity.addComponent(
      new SensorComponent({
        position: { x: -50, y: 75 },
        range: 20,
        angle: 0.4,
      }),
    );
    const sensor2 = entity.addComponent(
      new SensorComponent({
        position: { x: 50, y: 75 },
        range: 20,
        angle: 0.4,
      }),
    );
    const sensor3 = entity.addComponent(
      new SensorComponent({
        position: { x: -50, y: 75 },
        range: 30,
        angle: 0.4,
        reactsTo: SubstanceType.BARRIER,
      }),
    );
    const sensor4 = entity.addComponent(
      new SensorComponent({
        position: { x: 50, y: 75 },
        range: 30,
        angle: 0.4,
        reactsTo: SubstanceType.BARRIER,
      }),
    );
    entity.addComponent(
      new ConnectionComponent([
        { input: sensor1, output: motor2, weight: 1 },
        { input: sensor2, output: motor1, weight: 1 },
        { input: sensor3, output: motor1, weight: 1 },
        { input: sensor4, output: motor2, weight: 1 },
      ]),
    );
    EntityManager.addExistingEntity(entity);

    EntityManager.createEntity(
      new TransformableComponent({ position: { x: 950, y: 350 } }),
      new RenderComponent({
        asset: 'prefab-source',
        size: 100,
      }),
      new SourceComponent({
        range: 200,
      }),
    );

    // EntityManager.createEntity(
    //   new TransformableComponent({ x: 200, y: 400 }),
    //   new RenderComponent('source', 150, Phaser.BlendModes.ADD),
    //   new SourceComponent(150, SubstanceType.BARRIER),
    // );
  }

  private createSystems(): void {
    this.systems = [
      // new PhysicsSystem(this),
      // new SourceSystem(this),
      // new EngineSystem(this),
      // new SensorSystem(this),
      // new ConnectionSystem(this),
      // new ReactionSystem(this),
      // new RenderSystem(this),
      new RenderSystem(this),
      new SolidBodySystem(this),
      new PhysicsBodySystem(this),
      new MovementSystem(this),
    ];
  }

  public update(time: number, delta: number): void {
    this.fpsText?.setText('FPS: ' + (1000 / delta).toFixed(3));
    this.systems.forEach((s) => s.update(delta));
  }

  public isRunning(): boolean {
    return this.running;
  }

  public pause(flag: boolean): void {
    this.running = flag;
    this.systems.forEach((s) => s.pause(flag));

    // Wenn die Szene gestartet wird (play), wird ein neuer Snapshot erzeugt.
    if (flag) {
      MainScene.createSnapshot();
    }
  }

  // Speicherung des aktuellen Status von allen Entitäten
  public static createSnapshot(): void {
    const entities = EntityManager.getEntities();
    const snapshot = entities.map((entity) => entity.serialize());

    localStorage.setItem('snapshot', JSON.stringify(snapshot));
  }

  public static loadSnapshot(): void {
    const entities = EntityManager.getEntities();

    const snapshot = localStorage.getItem('snapshot');

    let aktuellerStatus;
    if (snapshot) {
      aktuellerStatus = JSON.parse(snapshot) as SerializedEntity[];
      entities.forEach((entity) => EntityManager.destroyEntity(entity.id));
      EntityManager.loadEntities(aktuellerStatus);
    } else {
      // TODO: Alert auslösen
      // swal('Es konnte keine Scene geladen werden! Bitte verwenden Sie zunächst den Speichern Knopf.');
    }
  }

  public static exportJson(): void {
    const entities = EntityManager.getEntities();
    const snapshot = entities.map((entity) => entity.serialize());
    const dataStr = JSON.stringify(snapshot);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportfkt = document.createElement('a');
    exportfkt.setAttribute('href', dataUri);
    exportfkt.setAttribute('download', 'data.json');
    document.body.append(exportfkt);
    exportfkt.click();
    exportfkt.remove();
  }

  public static importJson(): void {
    const entities = EntityManager.getEntities();
    const importEl = document.createElement('input');
    importEl.type = 'file';
    importEl.accept = 'application/json';

    importEl.addEventListener('change', () => {
      const files = importEl.files || [];

      if (files.length <= 0) {
        // TODO: Alert auslösen
        // swal('Es wurde keine korrete Datei ausgewählt.');
        return;
      }
      const fr = new FileReader();
      fr.addEventListener('load', () => {
        if (fr.result === null) return;

        const result = JSON.parse(fr.result as string) as SerializedEntity[];
        entities.forEach((entity) => EntityManager.destroyEntity(entity.id));
        EntityManager.loadEntities(result);
      });

      fr.readAsText(files[0]);
    });

    importEl.click();
  }

  private handleResize(): void {
    this.matter.world.setBounds();
  }
}
