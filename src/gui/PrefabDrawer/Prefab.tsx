import React from 'react';
import { Center, Image, ImageProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionImage = motion<ImageProps>(Image);

type PrefabHandler = (position: Vector2D) => void;
interface PrefabProps {
  src: string;
  dropHandler: PrefabHandler;
}
export function Prefab({ src, dropHandler }: PrefabProps): JSX.Element {
  return (
    <Center w="120px">
      <MotionImage
        src={src}
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
            dropHandler(position);
          }
        }}
      />
    </Center>
  );
}
