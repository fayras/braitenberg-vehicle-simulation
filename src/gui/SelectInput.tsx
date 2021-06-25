import React from 'react';
// import { InputNumber } from 'rsuite';

type Props = {
  value: number;
  label: string;
  options: { [key: string]: unknown };
  onInput?: (value: string | number) => void;
  min?: number;
  max?: number;
  readonly?: boolean;
};

export default function SelectInput(props: Props): JSX.Element {
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
