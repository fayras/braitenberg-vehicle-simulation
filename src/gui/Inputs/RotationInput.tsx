import React from 'react';
import { observer } from 'mobx-react-lite';
import RenderableAttribute from '../../components/RenderableAttribute';
import { Box, NumberInput, NumberInputField, FormLabel } from '@chakra-ui/react';
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

type Props = {
  attribute: RenderableAttribute<number, any>;
  label: string;
  onInput?: (value: string | number) => void;
  readonly?: boolean;
};

export default observer((props: Props): JSX.Element => {
  return (
    <Box mb="2.5">
      <FormLabel color="gray.800" fontSize="sm" mb="0">
        {props.label}
      </FormLabel>
      <NumberInput
        value={props.attribute.value}
        size="sm"
        variant="filled"
        disabled={props.readonly}
        onChange={(val) => {
          const value = Number(val);
          if (!isNaN(value)) {
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
