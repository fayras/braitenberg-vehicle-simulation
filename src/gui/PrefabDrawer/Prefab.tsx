import React from 'react';
import { Image, ImageProps, Center } from '@chakra-ui/react';
import { motion, Point2D } from 'framer-motion';

const MotionImage = motion<ImageProps>(Image);

type PrefabHandler = (position: Point2D) => void;
interface PrefabProps {
  src: string;
  dropHandler: PrefabHandler;
}
export default function Prefab({ src, dropHandler }: PrefabProps) {
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
      ></MotionImage>
    </Center>
  );
}
