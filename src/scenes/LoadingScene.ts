import Phaser from 'phaser';
import tankImg from '../../assets/tank.png';
import logoImg from '../../assets/logo.png';

import vehicleIcon from '../../assets/vehicle.png';
import sensorIcon from '../../assets/sensor.png';
import motorIcon from '../../assets/motor.png';
import sourceIcon from '../../assets/source_icon.png';
import obstacleIcon from '../../assets/Mauer.png';
import buttonSpriteSheet from '../../assets/gui_buttons.png';

import vehicle2a from '../../assets/prefabs/2a.png';
import vehicle2b from '../../assets/prefabs/2b.png';
import vehicle3a from '../../assets/prefabs/3a.png';
import vehicle3b from '../../assets/prefabs/3b.png';
import source from '../../assets/prefabs/source.png';
import blank from '../../assets/prefabs/blank.png';

export default class MainInterfaceScene extends Phaser.Scene {
  public constructor() {
    super({ key: 'LoadingScene' });
  }

  public preload(): void {
    this.createProgress();
    this.load.image('logo', logoImg);
    this.load.image('tank', tankImg);
    this.load.image('vehicle_icon', vehicleIcon);
    this.load.image('sensor_icon', sensorIcon);
    this.load.image('motor_icon', motorIcon);
    this.load.image('source_icon', sourceIcon);
    this.load.image('obstacle_Icon', obstacleIcon);

    this.load.image('prefab-2a', vehicle2a);
    this.load.image('prefab-2b', vehicle2b);
    this.load.image('prefab-3a', vehicle3a);
    this.load.image('prefab-3b', vehicle3b);
    this.load.image('prefab-source', source);
    this.load.image('prefab-blank', blank);

    this.load.spritesheet('button', buttonSpriteSheet, { frameWidth: 50, frameHeight: 48 });
  }

  public create(): void {
    this.scene.start('MainScene');
  }

  private createProgress(): void {
    const progress = this.add.graphics();

    this.load.on('progress', (value: number) => {
      progress.clear();
      progress.fillStyle(0xffffff, 1);
      progress.fillRect(0, 270, 800 * value, 60);
    });

    this.load.on('complete', () => {
      progress.destroy();
    });
  }
}
