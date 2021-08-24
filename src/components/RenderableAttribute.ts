import React, { useEffect, useState } from 'react';
import { makeObservable, observable, action } from 'mobx';

type ChangeHandler<T> = (value: T, oldValue: T) => void;

type ConditionalProps<S> = S extends React.FunctionComponent<any> ? Omit<React.ComponentProps<S>, 'attribute'> : {};

export default class RenderableAttribute<T, S extends React.FunctionComponent<any> | null> {
  public value: T;

  private reactComponent: S | undefined;

  private componentProps: ConditionalProps<S> | {};

  private changeHanlers: ChangeHandler<T>[] = [];

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

    makeObservable(this, {
      value: observable,
      set: action,
    });
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

  public render(): () => React.FunctionComponentElement<S> | null {
    if (this.reactComponent === undefined) {
      return () => null;
    }

    return () => {
      const props = {
        ...this.componentProps,
        attribute: this,
      };

      return React.createElement(this.reactComponent!, props, null);
    };
  }
}
