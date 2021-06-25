import React, { useState, useEffect, FunctionComponent } from 'react';
import { useStore } from 'effector-react';
import {
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { isOpen as openStore, close } from './store/prefabDrawer';

export default function PrefabDrawer(): JSX.Element {
  const isOpen = useStore(openStore);

  return (
    <Drawer
      variant="clickThrough"
      isOpen={isOpen}
      placement="right"
      closeOnOverlayClick={false}
      onClose={() => close()}
    >
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Create your account</DrawerHeader>

        <DrawerBody>
          <motion.div
            style={{ position: 'absolute' }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={1}
          >
            <div style={{ display: 'block', width: '100px', height: '100px', backgroundColor: 'red' }}></div>
          </motion.div>
        </DrawerBody>

        <DrawerFooter>
          {/* <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button> */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
