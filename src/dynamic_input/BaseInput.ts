import Phaser from 'phaser';
import { throttle, isEqual } from 'lodash-es';
import Entity from '../Entity';

export default abstract class BaseInput<T> extends Phaser.GameObjects.DOMElement {
  protected m_value: T;

  protected attribute: Settable<T>;

  private updateValue: () => void;

  protected label: string;

  protected entity: Entity;

  protected showDefaultLabel = true;

  public constructor(scene: Phaser.Scene, attribute: Settable<T>, value: T, label: string, entity: Entity) {
    super(scene, 0, 0);

    this.m_value = value;
    this.attribute = attribute;

    this.updateValue = throttle(this.onUpdate, 60);
    this.label = label;
    this.entity = entity;

    scene.add.existing(this);
  }

  public init(): void {
    const root = document.createElement('div');
    root.className = 'base-input-container';

    if (this.showDefaultLabel) {
      const labelEl = document.createElement('span');
      labelEl.innerText = this.label;
      labelEl.style.display = 'block';

      root.appendChild(labelEl);
    }

    const el = this.create(this.entity);
    root.appendChild(el);

    this.setElement(root);
  }

  protected abstract create(entity: Entity): Element;

  protected abstract onUpdate(): void;

  public set value(value: T) {
    const old = this.m_value;
    this.m_value = value;
    this.updateValue();

    if (!isEqual(old, value)) {
      this.attribute.set(value);
    }
  }

  public get value(): T {
    return this.m_value;
  }
}
