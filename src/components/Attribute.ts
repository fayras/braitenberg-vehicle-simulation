import BaseInput from '../dynamic_input/BaseInput';

type ElementConstructor<T, S> = new (scene: Phaser.Scene, attr: Settable<T>, value: T, label: string) => S;

export default class Attribute<T, S extends BaseInput<T>> implements Settable<T> {
  private value: T;

  private label: string;

  private Element: ElementConstructor<T, S>;

  private el: S | null = null;

  public constructor(value: T, label: string, renderAs: ElementConstructor<T, S>) {
    this.value = value;
    this.label = label;
    this.Element = renderAs;
  }

  public get(): T {
    return this.value;
  }

  public set(value: T): void {
    this.value = value;
    if (this.el) {
      this.el.value = value;
    }
  }

  public render(scene: Phaser.Scene): S {
    this.el = new this.Element(scene, this, this.value, this.label);

    // this.el.onChange(value => this.set(value));

    return this.el;
  }
}
