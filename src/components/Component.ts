import { v4 as uuidV4 } from 'uuid';
import React from 'react';
import { ComponentType } from '../enums';
import { RenderableAttribute } from './attributes/RenderableAttribute';
import { DisposableAttribute } from './attributes/DisposableAttribute';

export type ComponentId = string;
type UnknownRenderableAttribute = RenderableAttribute<unknown, React.FunctionComponent<unknown>>;

function isRenderableAttribute(argument: unknown): argument is UnknownRenderableAttribute {
  return argument instanceof RenderableAttribute;
}

function isDisposableAttribute(argument: unknown): argument is DisposableAttribute<unknown> {
  return argument instanceof DisposableAttribute;
}

export abstract class Component {
  // Hier wird einmal festgelegt, was für Typen die Klasse enthalten kann,
  // das ist nötig, damit später über diese mit `Object.keys(this)` drüber
  // iteriert werden kann.
  [key: string]: number | boolean | string | UnknownRenderableAttribute | DisposableAttribute<unknown> | unknown;

  public abstract type: ComponentType;

  public abstract label: string;

  public id: ComponentId;

  protected deletable = true;

  protected infoTip = '';

  protected constructor() {
    this.id = uuidV4();
  }

  public isDeletable(): boolean {
    return this.deletable;
  }

  public getInfo(): string {
    return this.infoTip;
  }

  public dispose(): void {
    Object.values(this)
      .filter(isDisposableAttribute)
      .forEach((attr) => {
        attr.dispose();
      });
  }

  public getRenderableAttributes(): UnknownRenderableAttribute[] {
    return Object.values(this).filter(isRenderableAttribute);
  }

  protected serializeAttributes(): Record<string, unknown> {
    const attrs: Record<string, unknown> = {};
    Object.keys(this).forEach((attr) => {
      const attribute = this[attr];
      if (isRenderableAttribute(attribute)) {
        attrs[attr] = attribute.value;
      }
    });

    return attrs;
  }

  public serialize(): SerializedComponent {
    const attributes = this.serializeAttributes();

    return {
      id: this.id,
      type: this.type,
      attributes,
    };
  }
}
