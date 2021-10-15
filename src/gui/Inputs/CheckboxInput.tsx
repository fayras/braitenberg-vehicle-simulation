import React from 'react';
import { observer } from 'mobx-react-lite';
import RenderableAttribute from '../../components/RenderableAttribute';
import { Box, Flex, Spacer, FormLabel } from '@chakra-ui/react';
import { Checkbox } from '@chakra-ui/react';

type Props = {
  attribute: RenderableAttribute<boolean, any>;
  label: string;
};

export default observer((props: Props): JSX.Element => {
  return (
    <Box mb="2.5">
      <Flex alignItems={'center'}>
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
