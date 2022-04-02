import React from 'react';
import { Attribute } from './Attribute';

type ConditionalProps<S> = S extends React.FunctionComponent<any>
  ? Omit<React.ComponentProps<S>, 'attribute'>
  : Record<string, never>;

export class RenderableAttribute<T, S extends React.FunctionComponent<any> | null> extends Attribute<T> {
  private readonly reactComponent: S | undefined;

  private readonly componentProps: ConditionalProps<S> | Record<string, never>;

  /**
   * Der Konstruktor!
   *
   * @param value
   * @param renderAs
   * @param props
   */
  public constructor(value: T, renderAs?: S, props?: ConditionalProps<S>) {
    super(value);
    this.reactComponent = renderAs || undefined;
    this.componentProps = props || {};
  }

  public render(): () => React.FunctionComponentElement<S> | null {
    if (this.reactComponent === undefined) {
      return () => null;
    }

    const component = this.reactComponent;
    return () => {
      const props = {
        ...this.componentProps,
        attribute: this,
        key: this.key,
      };

      return React.createElement(component!, props, null);
    };
  }
}
