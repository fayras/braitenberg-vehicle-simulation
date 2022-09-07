import React from 'react';
import { Attribute } from './Attribute';

type ConditionalProps<S> = S extends React.FunctionComponent<any>
  ? Omit<React.ComponentProps<S>, 'attribute'>
  : Record<string, never>;

export class RenderableAttribute<T, S extends React.FunctionComponent<any> | null = null> extends Attribute<T> {
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
    const { reactComponent, componentProps, key } = this;

    if (!reactComponent) {
      return function NullComponent() {
        return null;
      };
    }

    // eslint-disable-next-line react/function-component-definition
    return () => {
      const props = {
        ...componentProps,
        attribute: this,
        key,
      };

      return React.createElement(reactComponent, props, null);
    };
  }
}
