import React from 'react';
import { observer } from 'mobx-react-lite';
import RenderableAttribute from '../../components/RenderableAttribute';
import { Box, NumberInput, NumberInputField, FormLabel, Flex, Spacer } from '@chakra-ui/react';

type Props = {
  attribute: RenderableAttribute<Dimensions, any>;
  label: string;
  readonly?: boolean;
};

export default observer((props: Props): JSX.Element => {
  return (
    <Box mb="2.5">
      <FormLabel color="gray.800" fontSize="sm" mb="0">
        {props.label}
      </FormLabel>
      <Flex>
        <NumberInput
          value={props.attribute.value.width}
          size="sm"
          variant="filled"
          onChange={(val) => {
            props.attribute.value = { width: Number(val), height: props.attribute.value.height };
          }}
        >
          <NumberInputField />
        </NumberInput>
        <Spacer mx="1" />
        <NumberInput
          value={props.attribute.value.height}
          size="sm"
          variant="filled"
          onChange={(val) => {
            props.attribute.value = { width: props.attribute.value.width, height: Number(val) };
          }}
        >
          <NumberInputField />
        </NumberInput>
      </Flex>
    </Box>
  );
});
