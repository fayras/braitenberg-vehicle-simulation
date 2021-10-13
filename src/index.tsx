import Phaser from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import MainScene from './scenes/MainScene';
import MainInterfaceScene from './scenes/MainInterfaceScene';
import LoadingScene from './scenes/LoadingScene';
import Ui from './gui/index';

// import '../assets/css/picnic.min.css';
import '../assets/css/styling.css';

class Game extends React.Component {
  componentDidMount() {
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
      scene: [LoadingScene, MainScene, MainInterfaceScene],
      physics: {
        default: 'matter',
        matter: {
          gravity: { y: 0 },
        },
      },
    };

    // eslint-disable-next-line
    new Phaser.Game(config);
  }

  shouldComponentUpdate() {
    return false;
  }

  public render() {
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

class App extends React.Component {
  render() {
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
}

ReactDOM.render(<App />, document.body);
