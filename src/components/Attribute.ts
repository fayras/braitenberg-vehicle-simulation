export default class Attribute<T, S extends Phaser.GameObjects.DOMElement> {
  private value: T;

  private element: S;

  public constructor(value: T, renderAs: S) {
    this.value = value;
    this.element = renderAs;
  }

  public get(): T {
    return this.value;
  }

  public set(value: T): void {
    this.value = value;
  }

  public render(): void {
    console.log(this.value);
  }
}
