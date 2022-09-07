import Phaser from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { MainScene } from './scenes/MainScene';
import { LoadingScene } from './scenes/LoadingScene';
import { Ui } from './gui';

// import '../assets/css/picnic.min.css';
import '../assets/css/styling.css';

class Game extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  componentDidMount(): void {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      backgroundColor: '#EAEAEA',
      parent: 'phaser-game',
      scale: {
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%',
      },
      input: {
        windowEvents: false,
      },
      scene: [LoadingScene, MainScene],
      physics: {
        default: 'matter',
        matter: {
          gravity: { y: 0 },
        },
      },
    };

    // eslint-disable-next-line no-new
    new Phaser.Game(config);
  }

  // eslint-disable-next-line class-methods-use-this
  public override shouldComponentUpdate(): boolean {
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  public override render(): JSX.Element {
    return <div id="phaser-game" />;
  }
}

const theme = extendTheme({
  components: {
    Drawer: {
      variants: {
        clickThrough: {
          // parts: ['dialog, dialogContainer'],
          dialog: {
            pointerEvents: 'auto',
          },
          dialogContainer: {
            pointerEvents: 'none',
          },
        },
      },
    },
  },
});

function App(): React.ReactElement {
  return (
    <ChakraProvider theme={theme}>
      <div
        style={{
          display: 'flex',
          alignContent: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          height: '100vh',
        }}
      >
        <Ui />
        <Game />
      </div>
    </ChakraProvider>
  );
}

ReactDOM.render(<App />, document.body);
