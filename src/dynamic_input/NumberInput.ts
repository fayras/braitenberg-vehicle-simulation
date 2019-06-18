import Phaser from 'phaser';

export default class NumberInput extends Phaser.GameObjects.DOMElement {
  public constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'input');
    scene.add.existing(this);
  }

  // preUpdate(time, delta) {
  //     super.preUpdate(time, delta);
  // }
}
