import React from 'react';
import { observer } from 'mobx-react-lite';
import RenderableAttribute from '../../components/RenderableAttribute';
// import { InputNumber } from 'rsuite';

type Props = {
  // value: Dimensions;
  attribute: RenderableAttribute<Dimensions, any>;
  label: string;
  onInput?: (value: string | number) => void;
  readonly?: boolean;
};

export default observer((props: Props): JSX.Element => {
  return (
    <div>
      {props.label}:{props.attribute.value.width},{props.attribute.value.height}
      {/* <InputNumber
        value={props.value}
        onChange={(val) => (props.onInput ? props.onInput(val) : undefined)}
        disabled={props.readonly}
      /> */}
    </div>
  );
});
