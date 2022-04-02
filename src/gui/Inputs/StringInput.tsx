import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Flex, Spacer, FormLabel, Input } from '@chakra-ui/react';
import { RenderableAttribute } from '../../components/attributes/RenderableAttribute';

type Props = {
  attribute: RenderableAttribute<string, any>;
  label: string;
};

export const StringInput = observer((props: Props): JSX.Element => {
  return (
    <Box mb="2.5">
      <Flex alignItems={'center'}>
        <FormLabel color="gray.800" fontSize="sm" mb="0">
          {props.label}
        </FormLabel>
        <Spacer mx="1" />
        <Input
          size={'sm'}
          variant={'filled'}
          value={props.attribute.value}
          onChange={(event) => {
            props.attribute.value = event.target.value;
          }}
        />
      </Flex>
    </Box>
  );
});
