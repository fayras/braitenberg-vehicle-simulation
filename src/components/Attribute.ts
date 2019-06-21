import BaseInput from '../dynamic_input/BaseInput';
import Entity from '../Entity';

type ElementConstructor<T, S> = new (
  scene: Phaser.Scene,
  attr: Settable<T>,
  value: T,
  label: string,
  entity: Entity,
) => S;

export default class Attribute<T, S extends BaseInput<T>> implements Settable<T> {
  private value: T;

  private label: string;

  private Element: ElementConstructor<T, S>;

  private el: S | null = null;

  private changeHanlers: ((value: T) => void)[] = [];

  public constructor(value: T, label: string, renderAs: ElementConstructor<T, S>) {
    this.value = value;
    this.label = label;
    this.Element = renderAs;
  }

  public get(): T {
    return this.value;
  }

  public set(value: T, silent: boolean = false): void {
    const oldValue = this.value;

    this.value = value;

    if (this.el && !silent) {
      this.el.value = value;
    }

    if (value !== oldValue && !silent) {
      this.changeHanlers.forEach(handler => handler(value));
    }
  }

  public onChange(handler: (value: T) => void): void {
    this.changeHanlers.push(handler);
  }

  public removeHandler(handler: (value: T) => void): void {
    const found = this.changeHanlers.findIndex(h => h === handler);
    if (found) {
      this.changeHanlers.splice(found, 1);
    }
  }

  public render(scene: Phaser.Scene, entity: Entity): S {
    this.el = new this.Element(scene, this, this.value, this.label, entity);
    this.el.init();

    return this.el;
  }

  public renderedAs(type: any): boolean {
    return this.Element === type;
  }
}
