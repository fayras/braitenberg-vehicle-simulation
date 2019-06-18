import Phaser from 'phaser';

export default abstract class BaseInput<T> extends Phaser.GameObjects.DOMElement {
  protected value: T;

  protected onChangeHandler: (value: T) => void;

  public constructor(scene: Phaser.Scene, value: T, label: string) {
    super(scene, 0, 0);

    this.value = value;
    this.onChangeHandler = () => {};

    const root = document.createElement('div');
    const labelEl = document.createElement('span');
    labelEl.innerText = label;
    const el = this.create();

    root.appendChild(labelEl);
    root.appendChild(el);

    this.setElement(root);

    scene.add.existing(this);
  }

  protected abstract create(): Element;

  public onChange(handler: (value: T) => void): void {
    this.onChangeHandler = handler;
  }

  public set(value: T): void {
    this.value = value;
    this.onChangeHandler(value);
  }

  public get(): T {
    return this.value;
  }
}
