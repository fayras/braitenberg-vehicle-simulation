import React from 'react';
import { Button, IconButton, Icon } from 'rsuite';
import { useStore } from 'effector-react';
import { playState, togglePlay, reset } from './store';

export default function MainNavigation(): JSX.Element {
  const play = useStore(playState);

  return (
    <div>
      <IconButton appearance="primary" icon={<Icon icon={play ? 'play' : 'pause'} />} onClick={() => togglePlay()} />
      <IconButton color="blue" onClick={() => reset()}>
        Reset
      </IconButton>
      <IconButton color="blue">Snapshot</IconButton>
      <IconButton color="blue">Import</IconButton>
      <IconButton color="blue">Export</IconButton>
    </div>
  );
}
