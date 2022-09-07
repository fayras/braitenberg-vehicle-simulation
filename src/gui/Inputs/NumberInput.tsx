import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, FormLabel, NumberInput as ChakraNumberInput, NumberInputField } from '@chakra-ui/react';
import { RenderableAttribute } from '../../components/attributes/RenderableAttribute';

type Props = {
  attribute: RenderableAttribute<number>;
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
        isDisabled={props.readonly}
        onChange={(val) => {
          props.attribute.value = Number(val);
        }}
      >
        <NumberInputField />
      </ChakraNumberInput>
    </Box>
  );
});
