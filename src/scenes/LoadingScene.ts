import Phaser from 'phaser';
import tankImg from '../../assets/tank.png';
import logoImg from '../../assets/logo.png';
import sourceImg from '../../assets/source.png';
import vehicleIcon from '../../assets/vehicle.png';
import sensorIcon from '../../assets/sensor.png';
import motorIcon from '../../assets/motor.png';
import sourceIcon from '../../assets/source_icon.png';
import obstacleIcon from '../../assets/Mauer.png';
import buttonSpriteSheet from '../../assets/gui_buttons.png';

export default class MainInterfaceScene extends Phaser.Scene {
  public constructor() {
    super({ key: 'LoadingScene' });
  }

  public preload(): void {
    this.createProgress();
    this.load.image('logo', logoImg);
    //this.load.image('source', sourceImg);
    this.load.image('tank', tankImg);
    this.load.image('vehicle_icon', vehicleIcon);
    this.load.image('sensor_icon', sensorIcon);
    this.load.image('motor_icon', motorIcon);
    this.load.image('source_icon', sourceIcon);
    this.load.image('obstacle_Icon', obstacleIcon);
    this.load.spritesheet('button', buttonSpriteSheet, { frameWidth: 50, frameHeight: 48 });
    this.load.html('motor_template', 'assets/templates/motor.html');
    this.load.html('sensor_template', 'assets/templates/sensor.html');
    this.load.html('source_template', 'assets/templates/source.html');
    this.load.html('body_template', 'assets/templates/body.html');
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
