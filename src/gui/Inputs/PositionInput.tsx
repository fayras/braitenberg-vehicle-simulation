import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Flex, FormLabel, NumberInput, NumberInputField, Spacer } from '@chakra-ui/react';
import { RenderableAttribute } from '../../components/attributes/RenderableAttribute';

type Props = {
  attribute: RenderableAttribute<Vector2D>;
  label: string;
};

export const PositionInput = observer((props: Props): JSX.Element => {
  return (
    <Box mb="2.5">
      <FormLabel color="gray.800" fontSize="sm" mb="0">
        {props.label}
      </FormLabel>
      <Flex>
        <NumberInput
          value={props.attribute.value.x}
          size="sm"
          variant="filled"
          onChange={(val) => {
            props.attribute.value = { x: Number(val), y: props.attribute.value.y };
          }}
        >
          <NumberInputField />
        </NumberInput>
        <Spacer mx="1" />
        <NumberInput
          value={props.attribute.value.y}
          size="sm"
          variant="filled"
          onChange={(val) => {
            props.attribute.value = { x: props.attribute.value.x, y: Number(val) };
          }}
        >
          <NumberInputField />
        </NumberInput>
      </Flex>
    </Box>
  );
});
