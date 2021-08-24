import React from 'react';
import { observer } from 'mobx-react-lite';
import RenderableAttribute from '../../components/RenderableAttribute';

type Props = {
  // value: boolean;
  attribute: RenderableAttribute<boolean, any>;
  label: string;
};

export default observer((props: Props): JSX.Element => {
  // const { test: count, increase } = testStore();

  return (
    <div>
      {props.label}: {props.attribute.value}
    </div>
  );
});
