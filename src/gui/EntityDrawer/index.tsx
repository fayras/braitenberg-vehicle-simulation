import React from 'react';
import { useStore } from 'effector-react';
import { Drawer, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Flex } from '@chakra-ui/react';
import { selectedEntity, select } from '../_store/selectedEntity';
import ComponentCard from './ComponentCard';

export default function EntityDrawer(): JSX.Element {
  const entity = useStore(selectedEntity);
  const components = entity?.getAllComponents();

  return (
    <Drawer
      variant="clickThrough"
      isOpen={entity !== null}
      placement="right"
      closeOnOverlayClick={false}
      onClose={() => select(null)}
    >
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Ausgewählte Entität (ID {entity?.id})</DrawerHeader>

        <DrawerBody overflow="visible">
          <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
            {components?.map((component) => (
              <ComponentCard key={component.id} component={component} />
            ))}
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
