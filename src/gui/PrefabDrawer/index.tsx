import React from 'react';
import { useStore } from 'effector-react';
import { Drawer, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Flex } from '@chakra-ui/react';
import { isOpen as openStore, close } from '../_store/prefabDrawer';
import Prefab from './Prefab';

import Entity from '../../Entity';
import EntityManager from '../../EntityManager';

import SolidBodyComponent from '../../components/SolidBodyComponent';
import RenderComponent from '../../components/RenderComponent';
import MotorComponent from '../../components/MotorComponent';
import SensorComponent from '../../components/SensorComponent';
import SourceComponent from '../../components/SourceComponent';
import TransformableComponent from '../../components/TransformableComponent';
import ConnectionComponent from '../../components/ConnectionComponent';

import blank from '../../../assets/prefabs/blank.png';
import source from '../../../assets/prefabs/source.png';
import vehicle2a from '../../../assets/prefabs/2a.png';
import vehicle2b from '../../../assets/prefabs/2b.png';
import vehicle3a from '../../../assets/prefabs/3a.png';
import vehicle3b from '../../../assets/prefabs/3b.png';

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
        <DrawerHeader>Vorlagen</DrawerHeader>

        <DrawerBody overflow="visible">
          <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
            <Prefab
              src={blank}
              dropHandler={(position) => {
                EntityManager.createEntity(
                  // In der Simulations-Welt ist Grad 0 nach unten zeigend, damit die Entität,
                  // wie auf der Vorlage, nach oben zeigt, wird die einmal um 180° gedreht.
                  new TransformableComponent({ position, angle: Math.PI }),
                  new RenderComponent({ asset: 'prefab-blank', size: 100 }),
                );
              }}
            />

            <Prefab
              src={source}
              dropHandler={(position) => {
                EntityManager.createEntity(
                  new TransformableComponent({ position }),
                  new SourceComponent({
                    range: 100,
                  }),
                  new RenderComponent({ asset: 'prefab-source', size: 100 }),
                );
              }}
            />

            <Prefab
              src={vehicle2a}
              dropHandler={(position) => {
                const entity = new Entity();
                const transform = new TransformableComponent({
                  position,
                  angle: Math.PI,
                });
                entity.addComponent(transform);
                entity.addComponent(
                  new SolidBodyComponent({
                    size: { width: 100, height: 150 },
                  }),
                );
                entity.addComponent(
                  new RenderComponent({
                    asset: 'vehicle',
                    size: 100,
                  }),
                );
                const motor1 = entity.addComponent(
                  new MotorComponent({
                    position: { x: -50, y: 0 },
                    maxSpeed: 30,
                    defaultSpeed: 1,
                  }),
                );
                const motor2 = entity.addComponent(
                  new MotorComponent({
                    position: { x: 50, y: 0 },
                    maxSpeed: 30,
                    defaultSpeed: 1,
                  }),
                );
                const sensor1 = entity.addComponent(
                  new SensorComponent({
                    position: { x: -50, y: 75 },
                    range: 20,
                    angle: 0.4,
                  }),
                );
                const sensor2 = entity.addComponent(
                  new SensorComponent({
                    position: { x: 50, y: 75 },
                    range: 20,
                    angle: 0.4,
                  }),
                );
                entity.addComponent(
                  new ConnectionComponent({
                    inputIds: [sensor1, sensor2],
                    outputIds: [motor1, motor2],
                    weights: [
                      [1, 0],
                      [0, 1],
                    ],
                  }),
                );
                EntityManager.addExistingEntity(entity);
              }}
            />

            <Prefab
              src={vehicle2b}
              dropHandler={(position) => {
                const entity = new Entity();
                const transform = new TransformableComponent({
                  position,
                  angle: Math.PI,
                });
                transform.angle.set(-Math.PI / 2);
                entity.addComponent(transform);
                entity.addComponent(
                  new SolidBodyComponent({
                    size: { width: 100, height: 150 },
                  }),
                );
                entity.addComponent(
                  new RenderComponent({
                    asset: 'vehicle',
                    size: 100,
                  }),
                );
                const motor1 = entity.addComponent(
                  new MotorComponent({
                    position: { x: -50, y: 0 },
                    maxSpeed: 30,
                    defaultSpeed: 1,
                  }),
                );
                const motor2 = entity.addComponent(
                  new MotorComponent({
                    position: { x: 50, y: 0 },
                    maxSpeed: 30,
                    defaultSpeed: 1,
                  }),
                );
                const sensor1 = entity.addComponent(
                  new SensorComponent({
                    position: { x: -50, y: 75 },
                    range: 20,
                    angle: 0.4,
                  }),
                );
                const sensor2 = entity.addComponent(
                  new SensorComponent({
                    position: { x: 50, y: 75 },
                    range: 20,
                    angle: 0.4,
                  }),
                );
                entity.addComponent(
                  new ConnectionComponent({
                    inputIds: [sensor1, sensor2],
                    outputIds: [motor1, motor2],
                    weights: [
                      [0, 1],
                      [1, 0],
                    ],
                  }),
                );
                EntityManager.addExistingEntity(entity);
              }}
            />

            <Prefab
              src={vehicle3a}
              dropHandler={(position) => {
                const entity = new Entity();
                const transform = new TransformableComponent({
                  position,
                  angle: Math.PI,
                });
                transform.angle.set(-Math.PI / 2);
                entity.addComponent(transform);
                entity.addComponent(
                  new SolidBodyComponent({
                    size: { width: 100, height: 150 },
                  }),
                );
                entity.addComponent(
                  new RenderComponent({
                    asset: 'vehicle',
                    size: 100,
                  }),
                );
                const motor1 = entity.addComponent(
                  new MotorComponent({
                    position: { x: -50, y: 0 },
                    maxSpeed: 30,
                    defaultSpeed: 1,
                  }),
                );
                const motor2 = entity.addComponent(
                  new MotorComponent({
                    position: { x: 50, y: 0 },
                    maxSpeed: 30,
                    defaultSpeed: 1,
                  }),
                );
                const sensor1 = entity.addComponent(
                  new SensorComponent({
                    position: { x: -50, y: 75 },
                    range: 20,
                    angle: 0.4,
                  }),
                );
                const sensor2 = entity.addComponent(
                  new SensorComponent({
                    position: { x: 50, y: 75 },
                    range: 20,
                    angle: 0.4,
                  }),
                );
                entity.addComponent(
                  new ConnectionComponent({
                    inputIds: [sensor1, sensor2],
                    outputIds: [motor1, motor2],
                    weights: [
                      [-1, 0],
                      [0, -1],
                    ],
                  }),
                );
                EntityManager.addExistingEntity(entity);
              }}
            />

            <Prefab
              src={vehicle3b}
              dropHandler={(position) => {
                const entity = new Entity();
                const transform = new TransformableComponent({
                  position,
                  angle: Math.PI,
                });
                transform.angle.set(-Math.PI / 2);
                entity.addComponent(transform);
                entity.addComponent(
                  new SolidBodyComponent({
                    size: { width: 100, height: 150 },
                  }),
                );
                entity.addComponent(
                  new RenderComponent({
                    asset: 'vehicle',
                    size: 100,
                  }),
                );
                const motor1 = entity.addComponent(
                  new MotorComponent({
                    position: { x: -50, y: 0 },
                    maxSpeed: 30,
                    defaultSpeed: 1,
                  }),
                );
                const motor2 = entity.addComponent(
                  new MotorComponent({
                    position: { x: 50, y: 0 },
                    maxSpeed: 30,
                    defaultSpeed: 1,
                  }),
                );
                const sensor1 = entity.addComponent(
                  new SensorComponent({
                    position: { x: -50, y: 75 },
                    range: 20,
                    angle: 0.4,
                  }),
                );
                const sensor2 = entity.addComponent(
                  new SensorComponent({
                    position: { x: 50, y: 75 },
                    range: 20,
                    angle: 0.4,
                  }),
                );
                entity.addComponent(
                  new ConnectionComponent({
                    inputIds: [sensor1, sensor2],
                    outputIds: [motor1, motor2],
                    // TO-DO Negative Verknüpfung umsetzen
                    weights: [
                      [0, -1],
                      [-1, 0],
                    ],
                  }),
                );
                EntityManager.addExistingEntity(entity);
              }}
            />
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
