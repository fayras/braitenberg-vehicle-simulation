import React, { useState, useEffect, FunctionComponent } from 'react';
import { useStore } from 'effector-react';
import { selectedEntity, select } from '../_store/selectedEntity';
import { ComponentType } from '../../enums';
import MotorComponent from '../../components/MotorComponent';
import RenderableAttribute from '../../components/RenderableAttribute';

type RA = RenderableAttribute<unknown, FunctionComponent<unknown>>;

export default function EntityDrawer(): JSX.Element {
  const entity = useStore(selectedEntity);
  const component = entity?.getComponent<MotorComponent>(ComponentType.MOTOR);

  const attributes = component
    ? Object.values(component)
        .filter((a) => a instanceof RenderableAttribute)
        .map((a) => {
          const Comp = (a as RA).render();

          return <Comp />;
        })
    : [];

  return <div className="main-navigation">{attributes}</div>;
}
