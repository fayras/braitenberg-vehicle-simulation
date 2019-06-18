export default class Attribute<T, S extends Phaser.GameObjects.DOMElement> {
  private value: T;

  private label: string;

  private Element: new (scene: Phaser.Scene) => S;

  public constructor(value: T, label: string, renderAs: new (scene: Phaser.Scene) => S) {
    this.value = value;
    this.label = label;
    this.Element = renderAs;
  }

  public get(): T {
    return this.value;
  }

  public set(value: T): void {
    this.value = value;
  }

  public render(container: Phaser.Scene): S {
    const element = new this.Element(container);

    (element.node as HTMLInputElement).value = this.get() as any;
    element.addListener('change');
    element.on('change', (event: { target: HTMLInputElement }) => {
      this.set(event.target.value as any);
    });

    return element;
  }
}
