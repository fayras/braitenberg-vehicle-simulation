import React from 'react';
import { Button, IconButton, Icon } from 'rsuite';
import { useStore } from 'effector-react';
import { playState, togglePlay, reset } from './store/mainNavigation';

export default function MainNavigation(): JSX.Element {
  const play = useStore(playState);

  return (
    <div className="main-navigation">
      <IconButton
        className="raised"
        size="lg"
        icon={<Icon icon={play ? 'play' : 'pause'} />}
        onClick={() => togglePlay()}
      />
      <IconButton className="raised" size="lg" onClick={() => reset()} icon={<Icon icon="undo" />} />
      <IconButton className="raised" size="lg" icon={<Icon icon="save" />} />
      <IconButton className="raised" size="lg" icon={<Icon icon="file-download" />} />
      <IconButton className="raised" size="lg" icon={<Icon icon="file-upload" />} />
    </div>
  );
}
