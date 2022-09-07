import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  FormLabel,
  NumberInput,
  NumberInputField,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';
import { RenderableAttribute } from '../../components/attributes/RenderableAttribute';

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

type Props = {
  attribute: RenderableAttribute<number>;
  label: string;
  onInput?: (value: string | number) => void;
  readonly?: boolean;
};

export const RotationInput = observer((props: Props): JSX.Element => {
  return (
    <Box mb="2.5">
      <FormLabel color="gray.800" fontSize="sm" mb="0">
        {props.label}
      </FormLabel>
      <NumberInput
        value={props.attribute.value}
        size="sm"
        variant="filled"
        isDisabled={props.readonly}
        onChange={(val) => {
          const value = Number(val);
          if (!Number.isNaN(value)) {
            props.attribute.value = value;
          }
        }}
      >
        <NumberInputField />
      </NumberInput>
      <Slider
        aria-label="Rotation"
        value={mod(props.attribute.value, Math.PI * 2)}
        min={0}
        max={Math.PI * 2}
        step={0.01}
        onChange={(val) => {
          props.attribute.value = val;
        }}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  );
});
