import React, { useState } from 'react';
import { Box, Heading, IconButton, Tooltip, Collapse, useDisclosure, Spacer } from '@chakra-ui/react';
import Component from '../../components/Component';
import { DownIcon, RightIcon, TrashIcon } from '../icons';

interface ComponentCardProps {
  component: Component;
  onDelete?: () => void;
}

export default function ComponentCard({ component, onDelete }: ComponentCardProps) {
  const { isOpen, onToggle } = useDisclosure();
  const [isHover, setHover] = useState(false);
  const IndicatorIcon = isOpen ? DownIcon : RightIcon;

  const attributes = component.getRenderableAttributes().map((attr, index) => {
    const Comp = attr.render();

    return <Comp key={`ComponentCard_${component.id}_${index}`} />;
  });

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p="2"
      mb="3"
      w="100%"
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Box d="flex" alignItems="center" cursor="pointer" onClick={onToggle}>
        <IndicatorIcon w={4} h={4} mr="1" />
        <Heading size="sm">{component.name}</Heading>
        <Spacer />
        {isHover && (
          <Tooltip placement="top-end" label={'Komponente löschen'}>
            <IconButton
              variant="ghost"
              size="xs"
              isRound={true}
              height="4"
              disabled={!component.isDeletable()}
              icon={<TrashIcon color="gray.400" w={4} h={4} />}
              aria-label="Komponente entfernen"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
            />
          </Tooltip>
        )}
      </Box>
      <Collapse in={isOpen}>
        <Box p="2">{attributes}</Box>
      </Collapse>
    </Box>
  );
}
