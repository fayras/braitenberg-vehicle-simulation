import Phaser from 'phaser';

export default abstract class BaseInput<T> extends Phaser.GameObjects.DOMElement {
  protected m_value: T;

  protected onChangeHandler: (value: T) => void;

  public constructor(scene: Phaser.Scene, value: T, label: string) {
    super(scene, 0, 0);

    this.m_value = value;
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

  public set value(value: T) {
    const old = this.m_value;
    this.m_value = value;

    if (old !== value) {
      // this.attribute.set(value);
    }
  }

  public get value(): T {
    return this.m_value;
  }
}
