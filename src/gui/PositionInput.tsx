import React from 'react';

type Props = {
  value: Vector2D;
  label: string;
};

export default function PositionInput(props: Props): JSX.Element {
  // const { test: count, increase } = testStore();

  return (
    <div>
      {props.label}: {props.value.x}, {props.value.y}
    </div>
  );
}
