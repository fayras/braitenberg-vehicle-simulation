import Phaser from 'phaser';
import Matter from 'matter-js';
import logoImg from '../../assets/logo.png';
// import buttonImg from '../../assets/flixel-button.png';
import Entity from '../Entity';

import SolidBodyComponent from '../components/SolidBodyComponent';
import RenderComponent from '../components/RenderComponent';
import MotorComponent from '../components/MotorComponent';
import SensorComponent from '../components/SensorComponent';
import SourceComponent from '../components/SourceComponent';
import TransformableComponent from '../components/TransformableComponent';
import EditorScene from './EditorScene';

import EventBus from '../EventBus';
import System from '../systems/System';
import PhysicsSystem from '../systems/PhysicsSystem';
import RenderSystem from '../systems/RenderSystem';
import EngineSystem from '../systems/EngineSystem';
import MotionSystem from '../systems/MotionSystem';

import Button from '../gui/Button';
import ToggleButton from '../gui/ToggleButton';

export default class MainScene extends Phaser.Scene {
  private systems: System[] = [];

  private entities: Entity[] = [];

  private eventBus: EventBus;

  private running: boolean = false;

  public constructor() {
    super({ key: 'MainScene' });
    this.eventBus = new EventBus();
  }

  public preload(): void {
    this.load.image('logo', logoImg);
    // this.load.image('button', buttonImg);
    this.load.spritesheet('button', 'assets/flixel-button.png', { frameWidth: 80, frameHeight: 20 });
  }

  public create(): void {
    this.createSystems();
    // this.drawDebugCanvas();

    this.matter.world.setBounds();
    this.matter.add.mouseSpring({ length: 1, stiffness: 0.6 });

    this.scene.add('editor', EditorScene, false, { x: 600, y: 0 });

    for (let i = 0; i < 1; i += 1) {
      const entity = new Entity();
      entity.addComponent(new TransformableComponent({ x: 300, y: 100 }));
      entity.addComponent(new SolidBodyComponent(100));
      entity.addComponent(new RenderComponent('logo', 100));
      entity.addComponent(new SourceComponent(100));
      this.entities.push(entity);
    }

    const entity2 = new Entity();
    entity2.addComponent(new TransformableComponent({ x: 300, y: 100 }));
    entity2.addComponent(new SolidBodyComponent(100));
    entity2.addComponent(new RenderComponent('logo', 120));
    entity2.addComponent(new MotorComponent({ x: 50, y: 0 }, 20, 5));
    entity2.addComponent(new SensorComponent({ x: 0, y: 55 }, 50, 0.7));
    // entity2.addComponent(new ConnectionComponent([motorId], [sensorId], (layers = 0)));
    this.entities.push(entity2);

    const startButton = new ToggleButton(this, 70, 20, 'Starten', button => {
      this.running = !this.running;
      //Pause einfügen https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scenemanager/
    });
    const resetButton = new Button(this, 200, 20, 'Reset', button => {});
    const EditorButton = new ToggleButton(this, 700, 20, 'Editor', button => {
      if ((button as ToggleButton).isPressed()) {
        this.scene.sleep('EditorScene');
        button.setPosition(700, 20);
      } else {
        this.scene.launch('EditorScene', { x: 600, y: 0 });
        button.setPosition(550, 20);
      }
    });
  }

  private createSystems(): void {
    this.systems = [
      new PhysicsSystem(this, this.eventBus),
      new EngineSystem(this, this.eventBus),
      new MotionSystem(this, this.eventBus),
      new RenderSystem(this, this.eventBus),
    ];
  }

  public update(time: number, delta: number): void {
    if (this.running === false) {
      return;
    }

    this.systems.forEach(s => {
      const entities = this.entities.filter((e): boolean => e.hasComponents(...s.expectedComponents));

      s.update(entities, delta);
    });
  }

  private drawDebugCanvas(): void {
    const renderer = Matter.Render.create({
      element: document.body,
      engine: this.matter.world.engine,
      options: {
        showDebug: true,
        showBroadphase: true,
        showBounds: true,
        showVelocity: true,
        showCollisions: true,
        showSeparations: true,
        showAxes: true,
        showPositions: true,
        showAngleIndicator: true,
        showIds: true,
        showVertexNumbers: true,
      },
    });
    Matter.Render.run(renderer);
  }
}
