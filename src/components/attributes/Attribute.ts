import { computed, makeObservable, observable } from 'mobx';

export class Attribute<T> {
  protected internalValue: T;

  public readonly key: string;

  /**
   * Der Konstruktor!
   *
   * @param value
   * @param isObservable
   */
  public constructor(value: T, isObservable = true) {
    this.internalValue = value;
    this.key = (new Date().valueOf() + Math.random().toFixed(5)).toString();

    if (isObservable) {
      makeObservable<this, 'internalValue'>(this, {
        internalValue: observable,
        value: computed,
      });
    }
  }

  get value(): T {
    return this.internalValue;
  }

  set value(value: T) {
    this.internalValue = value;
  }
}
