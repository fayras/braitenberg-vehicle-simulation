import React, { DragEventHandler } from 'react';
import { useStore } from 'effector-react';
import {
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Image,
  ImageProps,
  Flex,
  Center,
} from '@chakra-ui/react';
import { motion, Point2D } from 'framer-motion';
import { isOpen as openStore, close } from './store/prefabDrawer';

import EntityManager from '../EntityManager';
import { SubstanceType, EmissionType, BodyShape } from '../enums';

import SolidBodyComponent from '../components/SolidBodyComponent';
import RenderComponent from '../components/RenderComponent';
import MotorComponent from '../components/MotorComponent';
import SensorComponent from '../components/SensorComponent';
import SourceComponent from '../components/SourceComponent';
import TransformableComponent from '../components/TransformableComponent';
import ConnectionComponent from '../components/ConnectionComponent';

import blank from '../../assets/prefabs/blank.png';
import source from '../../assets/prefabs/source.png';
import vehicle from '../../assets/vehicleV2.png';
import vehicle2a from '../../assets/prefabs/2a.png';
import vehicle2b from '../../assets/prefabs/2b.png';
import vehicle3a from '../../assets/prefabs/3a.png';
import vehicle3b from '../../assets/prefabs/3b.png';

const MotionImage = motion<ImageProps>(Image);

type PrefabHandler = (position: Point2D) => void;
const renderPrefab = (src: string, handler: PrefabHandler) => {
  return (
    <Center w="120px">
      <MotionImage
        // position={'absolute'}
        src={src}
        // style={{ position: 'absolute' }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={1}
        // TODO: Gucken, warum sich hier Typescript beschwert.
        // @ts-ignore
        onDragEnd={(event, info) => {
          // const { target } = event;
          const elements = document.elementsFromPoint(info.point.x, info.point.y);
          // Hier wird das zweite Element genommen, weil das erste ([0])
          // immer das Bild selbst ist.
          const target = elements[1];
          console.log(target);
          if (target instanceof HTMLCanvasElement) {
            const position = { x: info.point.x, y: info.point.y };
            handler(position);
          }
        }}
      ></MotionImage>
    </Center>
  );
};

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

        <DrawerBody overflow="visible">
          <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
            {renderPrefab(blank, (position) => {
              EntityManager.createEntity(
                // In der Simulations-Welt ist Grad 0 nach unten zeigend, damit die Entität,
                // wie auf der Vorlage, nach oben zeigt, wird die einmal um 180° gedreht.
                new TransformableComponent({ position, angle: Math.PI }),
                new RenderComponent({ asset: 'prefab-blank', size: 100 }),
              );
            })}
            {renderPrefab(source, (position) => {
              EntityManager.createEntity(
                new TransformableComponent({ position }),
                new SourceComponent({
                  range: 100,
                }),
                new RenderComponent({ asset: 'prefab-source', size: 100 }),
              );
            })}
          </Flex>
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
