import React from 'react';
// import { InputNumber } from 'rsuite';

type Props = {
  value: number;
  label: string;
  onInput?: (value: string | number) => void;
  readonly?: boolean;
};

export default function RotationInput(props: Props): JSX.Element {
  return (
    <div>
      {props.label}:{props.value}
      {/* <InputNumber
        value={props.value}
        onChange={(val) => (props.onInput ? props.onInput(val) : undefined)}
        disabled={props.readonly}
      /> */}
    </div>
  );
}
