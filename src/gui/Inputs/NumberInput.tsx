import React from 'react';
import { observer } from 'mobx-react-lite';
import RenderableAttribute from '../../components/RenderableAttribute';
import { Box, NumberInput, NumberInputField, FormLabel } from '@chakra-ui/react';

type Props = {
  attribute: RenderableAttribute<number, any>;
  label: string;
  min?: number;
  max?: number;
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
          props.attribute.value = Number(val);
        }}
      >
        <NumberInputField />
      </NumberInput>
    </Box>
  );
});
