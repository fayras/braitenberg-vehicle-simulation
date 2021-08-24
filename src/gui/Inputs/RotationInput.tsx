import React from 'react';
import { observer } from 'mobx-react-lite';
import RenderableAttribute from '../../components/RenderableAttribute';
// import { InputNumber } from 'rsuite';

type Props = {
  // value: number;
  attribute: RenderableAttribute<number, any>;
  label: string;
  onInput?: (value: string | number) => void;
  readonly?: boolean;
};

export default observer((props: Props): JSX.Element => {
  return (
    <div>
      {props.label}:{props.attribute.value}
      {/* <InputNumber
        value={props.value}
        onChange={(val) => (props.onInput ? props.onInput(val) : undefined)}
        disabled={props.readonly}
      /> */}
    </div>
  );
});
