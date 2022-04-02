import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, NumberInput as ChakraNumberInput, NumberInputField, FormLabel } from '@chakra-ui/react';
import { RenderableAttribute } from '../../components/attributes/RenderableAttribute';

type Props = {
  attribute: RenderableAttribute<number, any>;
  label: string;
  min?: number;
  max?: number;
  readonly?: boolean;
};

export const NumberInput = observer((props: Props): JSX.Element => {
  return (
    <Box mb="2.5">
      <FormLabel color="gray.800" fontSize="sm" mb="0">
        {props.label}
      </FormLabel>
      <ChakraNumberInput
        value={props.attribute.value}
        size="sm"
        variant="filled"
        disabled={props.readonly}
        onChange={(val) => {
          props.attribute.value = Number(val);
        }}
      >
        <NumberInputField />
      </ChakraNumberInput>
    </Box>
  );
});
