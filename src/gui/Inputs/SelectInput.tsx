import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Select, FormLabel } from '@chakra-ui/react';
import { RenderableAttribute } from '../../components/attributes/RenderableAttribute';

type Props = {
  attribute: RenderableAttribute<string | number, any>;
  label: string;
  options: Record<string, unknown>;
  onInput?: (value: string | number) => void;
  min?: number;
  max?: number;
  readonly?: boolean;
};

export const SelectInput = observer((props: Props): JSX.Element => {
  return (
    <Box mb="2.5">
      <FormLabel color="gray.800" fontSize="sm" mb="0">
        {props.label}
      </FormLabel>
      <Select
        variant="filled"
        size="sm"
        value={props.attribute.value}
        onChange={(event) => {
          props.attribute.value = event.target.value;
        }}
      >
        {Object.entries(props.options).map(([key, value]) => {
          return (
            <option key={key} value={value as string}>
              {value as string}
            </option>
          );
        })}
      </Select>
    </Box>
  );
});
