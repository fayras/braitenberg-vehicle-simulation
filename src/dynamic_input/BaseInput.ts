import Phaser from 'phaser';
import { throttle } from 'lodash-es';

export default abstract class BaseInput<T> extends Phaser.GameObjects.DOMElement {
  protected m_value: T;

  protected attribute: Settable<T>;

  private updateValue: () => void;

  public constructor(scene: Phaser.Scene, attribute: Settable<T>, value: T, label: string) {
    super(scene, 0, 0);

    this.m_value = value;
    this.attribute = attribute;

    this.updateValue = throttle(this.onUpdate, 60);

    const root = document.createElement('div');
    const labelEl = document.createElement('span');
    labelEl.innerText = label;
    labelEl.style.display = 'block';
    const el = this.create();

    root.appendChild(labelEl);
    root.appendChild(el);

    this.setElement(root);

    scene.add.existing(this);
  }

  protected abstract create(): Element;

  protected abstract onUpdate(): void;

  public set value(value: T) {
    const old = this.m_value;
    this.m_value = value;
    this.updateValue();

    if (old !== value) {
      this.attribute.set(value);
    }
  }

  public get value(): T {
    return this.m_value;
  }
}
