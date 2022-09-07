import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Checkbox, Flex, FormLabel, Spacer } from '@chakra-ui/react';
import { RenderableAttribute } from '../../components/attributes/RenderableAttribute';

type Props = {
  attribute: RenderableAttribute<boolean>;
  label: string;
};

export const CheckboxInput = observer((props: Props): JSX.Element => {
  return (
    <Box mb="2.5">
      <Flex alignItems="center">
        <FormLabel color="gray.800" fontSize="sm" mb="0">
          {props.label}
        </FormLabel>
        <Spacer mx="1" />
        <Checkbox
          isChecked={props.attribute.value}
          onChange={(val) => {
            props.attribute.value = val.target.checked;
          }}
        />
      </Flex>
    </Box>
  );
});
