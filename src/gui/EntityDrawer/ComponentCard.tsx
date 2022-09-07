import React, { useState } from 'react';
import { Box, Collapse, Heading, IconButton, Spacer, Tooltip, useDisclosure } from '@chakra-ui/react';
import { ECSComponent } from '../../components/ECSComponent';
import { DownIcon, RightIcon, TrashIcon } from '../icons';

interface ComponentCardProps {
  component: ECSComponent;
  onDelete?: () => void;
}

export function ComponentCard({ component, onDelete }: ComponentCardProps): JSX.Element {
  const { isOpen, onToggle } = useDisclosure();
  const [isHover, setHover] = useState(false);
  const IndicatorIcon = isOpen ? DownIcon : RightIcon;

  const attributes = component.getRenderableAttributes().map((attr) => {
    const Comp = attr.render();

    return <Comp key={`ComponentCard_${component.id}_${attr.key}`} />;
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
        <Heading size="sm">{component.label}</Heading>
        <Spacer />
        {isHover && (
          <Tooltip placement="top-end" label="Komponente löschen">
            <IconButton
              variant="ghost"
              size="xs"
              isRound
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
        <Box p="2" pb="0">
          {attributes}
        </Box>
      </Collapse>
    </Box>
  );
}
