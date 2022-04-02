import { computed, makeObservable, observable } from 'mobx';
import { Attribute } from './Attribute';

export class VolatileAttribute<T> extends Attribute<T | undefined> {
  constructor(value?: T) {
    super(value, false);

    makeObservable<this, 'internalValue'>(this, {
      internalValue: observable.ref,
      value: computed,
    });
  }
}
