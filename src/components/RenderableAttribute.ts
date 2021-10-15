import React, { useEffect, useState } from 'react';
import { makeObservable, observable, action, computed } from 'mobx';

type ChangeHandler<T> = (value: T, oldValue: T) => void;

type ConditionalProps<S> = S extends React.FunctionComponent<any> ? Omit<React.ComponentProps<S>, 'attribute'> : {};

export default class RenderableAttribute<T, S extends React.FunctionComponent<any> | null> {
  public value: T;

  private reactComponent: S | undefined;

  private componentProps: ConditionalProps<S> | {};

  private changeHanlers: ChangeHandler<T>[] = [];

  private key: string;

  /**
   * Der Konstruktor!
   *
   * @param value
   * @param renderAs
   * @param props
   */
  public constructor(value: T, renderAs?: S, props?: ConditionalProps<S>) {
    this.value = value;
    this.reactComponent = renderAs || undefined;
    this.componentProps = props || {};
    this.key = (new Date().valueOf() + Math.random().toFixed(5)).toString();

    makeObservable(this, {
      value: observable,
      // set: action,
    });
  }

  public render(): () => React.FunctionComponentElement<S> | null {
    if (this.reactComponent === undefined) {
      return () => null;
    }

    return () => {
      const props = {
        ...this.componentProps,
        attribute: this,
        key: this.key,
      };

      return React.createElement(this.reactComponent!, props, null);
    };
  }
}
