import React, { useMemo } from 'react';
import { observer, Observer } from 'mobx-react-lite';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { PlusIcon } from '../icons';

import { store as selectedEntityStore } from '../_store/selectedEntity';
import { ComponentCard } from './ComponentCard';
import { HierarchyEntityCard } from './HierarchyEntityCard';
import EntityManager from '../../EntityManager';
import { MotorComponent } from '../../components/MotorComponent';
import { NameComponent } from '../../components/NameComponent';

export const EntityDrawer = observer((): React.ReactElement | null => {
  const entity = selectedEntityStore.selectedEntity;
  const parent = entity?.getParent();
  const { children, components } = selectedEntityStore;

  const parentComponent = useMemo(() => {
    if (!parent) {
      return undefined;
    }

    return (
      <HierarchyEntityCard
        key={parent.id}
        entity={parent}
        isParent
        onClick={() => selectedEntityStore.select(parent)}
      />
    );
  }, [parent]);

  const childrenComponent = useMemo(
    () =>
      children?.map((child) => (
        <HierarchyEntityCard key={child.id} entity={child} onClick={() => selectedEntityStore.select(child)} />
      )),
    [children],
  );

  if (entity === null) {
    return null;
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
        <DrawerHeader>{selectedEntityStore.name || entity.id}</DrawerHeader>

        <DrawerBody>
          <Observer>
            {() => (
              <Flex flexDirection="column" justifyContent="center" alignItems="center">
                {parentComponent}
                {components.map((component) => (
                  <ComponentCard
                    key={component.id}
                    component={component}
                    onDelete={() => EntityManager.removeComponent(entity.id, component)}
                  />
                ))}
                {childrenComponent}
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
                  EntityManager.addComponent(entity.id, new NameComponent('Name'));
                }}
              >
                Name
              </MenuItem>
              <MenuItem
                onClick={() => {
                  EntityManager.addComponent(
                    entity.id,
                    new MotorComponent({
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
