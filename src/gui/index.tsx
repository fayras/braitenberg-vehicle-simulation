import React from 'react';

import MainNavigation from './MainNavigation';

import 'rsuite/dist/styles/rsuite-default.css';

export default function App(): JSX.Element {
  // const { test: count, increase } = testStore();

  return (
    <div className="ui-container">
      <MainNavigation />
      {/* <button onClick={increase}>one up</button> */}
    </div>
  );
}
