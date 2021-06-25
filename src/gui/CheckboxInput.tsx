import React from 'react';

type Props = {
  value: boolean;
  label: string;
};

export default function CheckboxInput(props: Props): JSX.Element {
  // const { test: count, increase } = testStore();

  return (
    <div>
      {props.label}: {props.value}
    </div>
  );
}
