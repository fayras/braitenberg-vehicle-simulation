import BaseInput from '../dynamic_input/BaseInput';

export default class Attribute<T, S extends BaseInput<T>> {
  private value: T;

  private label: string;

  private Element: new (scene: Phaser.Scene, value: T, label: string) => S;

  private el: S | null = null;

  public constructor(value: T, label: string, renderAs: new (scene: Phaser.Scene, value: T, label: string) => S) {
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
    this.el = new this.Element(scene, this.value, this.label);

    // this.el.onChange(value => this.set(value));

    return this.el;
  }
}
