import React from 'react';

import MainNavigation from './MainNavigation';
import EntityDrawer from './EntityDrawer';
import PrefabDrawer from './PrefabDrawer';

// import 'rsuite/dist/styles/rsuite-default.css';

export default function App(): JSX.Element {
  // const { test: count, increase } = testStore();

  return (
    <div className="ui-container click-through">
      <MainNavigation />
      <EntityDrawer />
      <PrefabDrawer />
    </div>
  );
}
