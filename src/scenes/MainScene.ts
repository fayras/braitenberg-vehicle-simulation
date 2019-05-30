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
import tankImg from '../../assets/tank.png';
import logoImg from '../../assets/logo.png';
import sourceImg from '../../assets/source.png';
import buttonSpriteSheet from '../../assets/gui_icons.png';

import EventBus from '../EventBus';
import System from '../systems/System';
import PhysicsSystem from '../systems/PhysicsSystem';
import RenderSystem from '../systems/RenderSystem';
import EngineSystem from '../systems/EngineSystem';
import SensorSystem from '../systems/SensorSystem';

import Button from '../gui/Button';
import ToggleButton from '../gui/ToggleButton';
import ConnectionComponent from '../components/ConnectionComponent';
import ConnectionSystem from '../systems/ConnectionSystem';
import SourceSystem from '../systems/SourceSystem';
import { SubstanceType } from '../enums';

export default class MainScene extends Phaser.Scene {
  private systems: System[] = [];

  private entities: Entity[] = [];

  private eventBus: EventBus;

  private running: boolean = true;

  public constructor() {
    super({ key: 'MainScene' });
    this.eventBus = new EventBus();
  }

  public preload(): void {
    this.load.image('logo', logoImg);
    this.load.image('source', sourceImg);
    this.load.image('tank', tankImg);
    this.load.spritesheet('button', buttonSpriteSheet, { frameWidth: 158, frameHeight: 159.2 });
  }

  public create(): void {
    this.createSystems();
    // this.drawDebugCanvas();

    this.matter.world.setBounds();
    this.matter.add.mouseSpring({ length: 1, stiffness: 0.6 });

    this.scene.add('editor', EditorScene, false);
    this.scene.add('settings', SettingScene, false);

    for (let i = 0; i < 1; i += 1) {
      const entity = new Entity();
      entity.addComponent(new TransformableComponent({ x: 300, y: 100 }));
      entity.addComponent(new SolidBodyComponent(100));
      entity.addComponent(new RenderComponent('logo', 110));
      // entity.addComponent(new SourceComponent(150));
      this.entities.push(entity);
    }

    const entity2 = new Entity();
    entity2.addComponent(new TransformableComponent({ x: 300, y: 200 }));
    entity2.addComponent(new SolidBodyComponent(100));
    entity2.addComponent(new RenderComponent('tank', 100));
    const motor1 = entity2.addComponent(new MotorComponent({ x: -50, y: 0 }, 20, 2));
    const motor2 = entity2.addComponent(new MotorComponent({ x: 50, y: 0 }, 20, 2));
    const sensor1 = entity2.addComponent(new SensorComponent({ x: 0, y: 55 }, 80, 1.3));
    // const sensor2 = entity2.addComponent(new SensorComponent({ x: 40, y: 55 }, 80, 1.3));
    entity2.addComponent(new ConnectionComponent([sensor1], [motor1, motor2], [[0, 1]]));
    this.entities.push(entity2);

    const light = new Entity();
    light.addComponent(new TransformableComponent({ x: 500, y: 300 }));
    light.addComponent(new RenderComponent('source', 300, Phaser.BlendModes.ADD));
    light.addComponent(new SourceComponent(300));
    this.entities.push(light);

    const light2 = new Entity();
    light2.addComponent(new TransformableComponent({ x: 200, y: 400 }));
    light2.addComponent(new RenderComponent('source', 150, Phaser.BlendModes.ADD));
    light2.addComponent(new SourceComponent(150, SubstanceType.BARRIER));
    this.entities.push(light2);

    const startButton = new ToggleButton(this, 70, 35, '', 4, 8, button => {
      this.running = !this.running;
    });
    const resetButton = new Button(this, 200, 35, '', 29, button => {});
    const EditorButton = new ToggleButton(this, 700, 35, '', 2, 2, button => {
      if ((button as ToggleButton).isPressed()) {
        this.scene.sleep('EditorScene');
        button.setPosition(700, 35);
      } else {
        this.scene.launch('EditorScene', { x: 500, y: 0 });
        button.setPosition(535, 35);
      }
    });
    const testButton = new ToggleButton(this, 350, 35, '', 14, 14, button => {
      if ((button as ToggleButton).isPressed()) {
        this.scene.sleep('SettingScene');
      } else {
        this.scene.launch('SettingScene');
      }
    });
  }

  private createSystems(): void {
    this.systems = [
      new PhysicsSystem(this, this.eventBus),
      new SourceSystem(this, this.eventBus),
      new EngineSystem(this, this.eventBus),
      new SensorSystem(this, this.eventBus),
      new ConnectionSystem(this, this.eventBus),
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
}
