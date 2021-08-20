import React from 'react';
import { Image, ImageProps, Center, Box, Collapse, Button, useDisclosure, Heading } from '@chakra-ui/react';
// import { motion, Point2D } from 'framer-motion';
import Component from '../../components/Component';
import RenderableAttribute from '../../components/RenderableAttribute';
import { DownIcon, RightIcon } from '../icons';

type RA = RenderableAttribute<unknown, React.FunctionComponent<unknown>>;
// const MotionImage = motion<ImageProps>(Image);

interface ComponentCardProps {
  component: Component;
}

export default function ComponentCard({ component }: ComponentCardProps) {
  const { isOpen, onToggle } = useDisclosure();
  const IndicatorIcon = isOpen ? DownIcon : RightIcon;

  const attributes = Object.values(component)
    .filter((attr) => attr instanceof RenderableAttribute)
    .map((attr, index) => {
      const Comp = (attr as RA).render();

      return <Comp key={`${component.id}_${index}`} />;
    });

  return (
    // <Center w="120px"></Center>
    <Box borderWidth="1px" borderRadius="lg" p="2" mb="3" w="100%">
      <Box d="flex" alignItems="center" cursor="pointer" onClick={onToggle}>
        <IndicatorIcon w={4} h={4} mr="1" />
        <Heading size="sm">{component.name}</Heading>
      </Box>
      <Collapse in={isOpen}>
        <Box p="2">{attributes}</Box>
      </Collapse>
    </Box>
  );
}
