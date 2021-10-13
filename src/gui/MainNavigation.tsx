import React from 'react';
import { IconButton, Flex, Spacer } from '@chakra-ui/react';
import { store } from './_store/mainNavigation';
import { store as prefabDrawerStore } from './_store/prefabDrawer';
import { PauseIcon, PlayIcon, RewindIcon, BookmarkIcon, MenuIcon } from './icons';
import { observer } from 'mobx-react-lite';

const TogglePlayButton = observer((): JSX.Element => {
  return (
    <IconButton
      aria-label="play"
      size="lg"
      boxShadow="base"
      icon={store.playState ? <PlayIcon w={8} h={8} /> : <PauseIcon w={8} h={8} />}
      onClick={() => store.togglePlay()}
    />
  );
});

const ResetButton = observer((): JSX.Element => {
  return (
    <IconButton
      aria-label="reset"
      size="lg"
      boxShadow="base"
      onClick={() => store.reset()}
      icon={<RewindIcon w={8} h={8} />}
    />
  );
});

export default function MainNavigation(): JSX.Element {
  return (
    <Flex className="main-navigation click-through">
      <TogglePlayButton />
      <ResetButton />
      <IconButton aria-label="save" size="lg" boxShadow="base" icon={<BookmarkIcon w={8} h={8} />} />
      <Spacer className="click-through" />
      <IconButton
        aria-label="PrefabSidebar Icon"
        size="lg"
        boxShadow="base"
        right={0}
        icon={<MenuIcon w={8} h={8} />}
        onClick={() => prefabDrawerStore.open()}
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
