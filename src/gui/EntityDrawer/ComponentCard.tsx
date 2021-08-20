import React from 'react';
import { Box, Heading, Collapse, useDisclosure } from '@chakra-ui/react';
import Component from '../../components/Component';
import { DownIcon, RightIcon } from '../icons';

interface ComponentCardProps {
  component: Component;
}

export default function ComponentCard({ component }: ComponentCardProps) {
  const { isOpen, onToggle } = useDisclosure();
  const IndicatorIcon = isOpen ? DownIcon : RightIcon;

  const attributes = component.getRenderableAttributes().map((attr, index) => {
    const Comp = attr.render();

    return <Comp key={`${component.id}_${index}`} />;
  });

  return (
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
