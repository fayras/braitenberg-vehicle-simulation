import React, { useState, useEffect, FunctionComponent } from 'react';
import { useStore } from 'effector-react';
import { Drawer, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Flex } from '@chakra-ui/react';
import { selectedEntity, select } from '../_store/selectedEntity';
import { ComponentType } from '../../enums';
import MotorComponent from '../../components/MotorComponent';
import ComponentCard from './ComponentCard';

export default function EntityDrawer(): JSX.Element {
  const entity = useStore(selectedEntity);
  const components = entity?.getAllComponents();
  // const component = entity?.getComponent<MotorComponent>(ComponentType.MOTOR);

  // const attributes = component
  //   ? Object.values(component)
  //       .filter((a) => a instanceof RenderableAttribute)
  //       .map((a) => {
  //         const Comp = (a as RA).render();

  //         return <Comp />;
  //       })
  //   : [];

  // return <div className="main-navigation">{attributes}</div>;

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
