import React, { useState } from 'react';
import { Box, Heading, Spacer } from '@chakra-ui/react';
import { Entity } from '../../Entity';
import { DoubleLeftIcon, DoubleRightIcon } from '../icons';
import { NameComponent } from '../../components/NameComponent';
import { ComponentType } from '../../enums';

interface HirarchyEntityCardProps {
  entity: Entity;
  isParent?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

export function HirarchyEntityCard({ entity, isParent, onClick }: HirarchyEntityCardProps): JSX.Element {
  const [isHover, setHover] = useState(false);
  const nameComponent = entity.getComponent<NameComponent>(ComponentType.NAME);
  const name = nameComponent ? nameComponent.name.value : entity.id;
  const IndicatorIcon = isParent ? DoubleLeftIcon : DoubleRightIcon;

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
      <Box
        d="flex"
        alignItems="center"
        cursor="pointer"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
      >
        <IndicatorIcon w={4} h={4} mr="1" />
        <Heading size="sm">{name}</Heading>
        <Spacer />
      </Box>
    </Box>
  );
}
