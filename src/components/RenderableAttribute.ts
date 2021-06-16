import React, { useEffect, useState } from 'react';

type ChangeHandler<T> = (value: T, oldValue: T) => void;

export default class RenderableAttribute<T, S extends React.FunctionComponent<any>> {
  private value: T;

  private reactComponent: S;

  private componentProps: Omit<React.ComponentProps<S>, 'value'>;

  private changeHanlers: ChangeHandler<T>[] = [];

  /**
   * Der Konstruktor!
   *
   * @param value
   * @param renderAs
   * @param props
   */
  public constructor(value: T, reactComponent: S, props: Omit<React.ComponentProps<S>, 'value'>) {
    this.value = value;
    this.reactComponent = reactComponent;
    this.componentProps = props;
  }

  public get(): T {
    return this.value;
  }

  public set(value: T, silent: boolean = false): void {
    const oldValue = this.value;

    this.value = value;

    if (value !== oldValue && !silent) {
      this.changeHanlers.forEach((handler) => handler(value, oldValue));
    }
  }

  public onChange(handler: ChangeHandler<T>): void {
    this.changeHanlers.push(handler);
  }

  public removeHandler(handler: ChangeHandler<T>): void {
    const found = this.changeHanlers.findIndex((h) => h === handler);
    if (found) {
      this.changeHanlers.splice(found, 1);
    }
  }

  public render(): () => React.FunctionComponentElement<S> {
    return () => {
      const [val, setVal] = useState(this.value);

      useEffect(() => {
        const handler = (val: T) => setVal(val);
        this.onChange(handler);

        return () => this.removeHandler(handler);
      });

      const props = {
        ...this.componentProps,
        value: val,
        onInput: (value: T) => this.set(value),
      };

      return React.createElement(this.reactComponent, props, null);
    };
  }
}
