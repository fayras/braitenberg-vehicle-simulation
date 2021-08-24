import React from 'react';
import { observer } from 'mobx-react-lite';
import RenderableAttribute from '../../components/RenderableAttribute';

type Props = {
  // value: Vector2D;
  attribute: RenderableAttribute<Vector2D, any>;
  label: string;
};

export default observer((props: Props): JSX.Element => {
  // const { test: count, increase } = testStore();

  return (
    <div>
      {props.label}: {props.attribute.value.x}, {props.attribute.value.y}
    </div>
  );
});
