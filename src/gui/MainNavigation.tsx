import React from 'react';
import { IconButton, Flex, Spacer } from '@chakra-ui/react';
import { useStore } from 'effector-react';
import { playState, togglePlay, reset } from './_store/mainNavigation';
import { open as openPrefabDrawer } from './_store/prefabDrawer';
import { PauseIcon, PlayIcon, RewindIcon, BookmarkIcon, MenuIcon } from './icons';

export default function MainNavigation(): JSX.Element {
  const play = useStore(playState);

  return (
    <Flex className="main-navigation click-through">
      <IconButton
        aria-label="play"
        size="lg"
        boxShadow="base"
        icon={play ? <PlayIcon w={8} h={8} /> : <PauseIcon w={8} h={8} />}
        onClick={() => togglePlay()}
      />
      <IconButton
        aria-label="reset"
        size="lg"
        boxShadow="base"
        onClick={() => reset()}
        icon={<RewindIcon w={8} h={8} />}
      />
      <IconButton aria-label="save" size="lg" boxShadow="base" icon={<BookmarkIcon w={8} h={8} />} />
      <Spacer className="click-through" />
      <IconButton
        aria-label="PrefabSidebar Icon"
        size="lg"
        boxShadow="base"
        right={0}
        icon={<MenuIcon w={8} h={8} />}
        onClick={() => openPrefabDrawer()}
      />
      {/* <IconButton
        aria-label="download" size="lg"
        boxShadow="base" icon={<Icon icon="file-download" />} />
      <IconButton
        aria-label="upload" size="lg"
        boxShadow="base" icon={<Icon icon="file-upload" />} /> */}
    </Flex>
  );
}
