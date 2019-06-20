import BaseInput from '../dynamic_input/BaseInput';

type ElementConstructor<T, S> = new (scene: Phaser.Scene, attr: Settable<T>, value: T, label: string) => S;

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

  public set(value: T): void {
    const oldValue = this.value;

    this.value = value;

    if (this.el) {
      this.el.value = value;
    }

    if (value !== oldValue) {
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

  public render(scene: Phaser.Scene): S {
    this.el = new this.Element(scene, this, this.value, this.label);

    return this.el;
  }
}
