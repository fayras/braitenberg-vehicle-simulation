import { Attribute } from './Attribute';

type DisposableType<S> = [S, IDisposable];

export class DisposableAttribute<T> extends Attribute<DisposableType<T>> {
  /**
   * Der Konstruktor!
   *
   * @param value
   */
  public constructor(value: DisposableType<T>) {
    super(value);
  }

  public dispose(): void {
    const disposer = this.value[1];
    disposer?.();
  }

  get value(): DisposableType<T> {
    return super.value;
  }

  set value(value: DisposableType<T>) {
    if (this.value[0] !== value[0]) {
      this.dispose();
    }

    super.value = value;
  }
}
