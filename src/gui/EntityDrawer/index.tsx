import React from 'react';
import { observer, Observer } from 'mobx-react-lite';
import {
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from '@chakra-ui/react';
import { PlusIcon } from '../icons';

import { store as selectedEntityStore } from '../_store/selectedEntity';
import ComponentCard from './ComponentCard';
import EntityManager from '../../EntityManager';
import MotorComponent from '../../components/MotorComponent';

export default observer((): JSX.Element => {
  const entity = selectedEntityStore.selectedEntity;
  const components = selectedEntityStore.components;
  if (entity === null) {
    return <></>;
  }

  return (
    <Drawer
      variant="clickThrough"
      isOpen={selectedEntityStore.isSelected}
      placement="right"
      closeOnOverlayClick={false}
      onClose={() => selectedEntityStore.select(null)}
    >
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Ausgewählte Entität (ID {entity.id})</DrawerHeader>

        <DrawerBody>
          <Observer>
            {() => (
              <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                {components.map((component) => (
                  <ComponentCard
                    key={component.id}
                    component={component}
                    onDelete={() => EntityManager.removeComponent(entity.id, component)}
                  />
                ))}
              </Flex>
            )}
          </Observer>
        </DrawerBody>

        <DrawerFooter justifyContent="left">
          <Menu isLazy>
            <MenuButton
              as={Button}
              variant="ghost"
              size="sm"
              isFullWidth
              textAlign="left"
              px="2"
              leftIcon={<PlusIcon w={5} h={5} />}
              iconSpacing="1"
            >
              Komponente hinzufügen
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  EntityManager.addComponent(
                    entity.id,
                    new MotorComponent({
                      position: { x: 0, y: 0 },
                      maxSpeed: 50,
                      defaultSpeed: 5,
                    }),
                  );
                }}
              >
                Motor
              </MenuItem>
              <MenuItem>Sensor</MenuItem>
              <MenuItem>Quelle</MenuItem>
              <MenuItem>Fester Körper</MenuItem>
              <MenuItem>Verbindungsnetzwerk</MenuItem>
            </MenuList>
          </Menu>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
});
