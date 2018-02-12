import React from 'react';
import { Board } from './board-component.jsx';

export const VALID_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export class Game extends React.Component {
  constructor(props){
    super();
    this.state = getInitialGameState();
    this.channel = props.channel;
    this.channel.join()
        .receive("ok", view => {
          console.log("Got okay: ",view);
        })
        .receive("error", res => {
            console.log("Got error: ", res);
        })
  }

  render(){
    return (<div>
      <h1>Game</h1>
      <button className="btn btn-primary" onClick={ () => { this.resetGame() }}>
        Reset game
      </button>
      <div>
         {
           isGameOver(this.state)
           ?
           <div>
             <h2>Game over</h2>
             <h3>Score: <b>{this.state.clicks}</b> <small>(less is better)</small></h3>
           </div>
           :
           <div>
             <h2>Playing...</h2>
             <h3>Clicks: {this.state.clicks}</h3>
           </div>
         }
      </div>
      <div>
        <Board board={ this.state.board }
               clicksEnabled={ this.state.clicksEnabled }
               tileClicked={ (tile) => this.tileClicked(tile) }/>
      </div>
    </div>)
  }

  resetGame() {
    this.setState(getInitialGameState());
  }

  setTileVisible(tile, callback) {
    let newBoard = [ ...this.state.board ];

    newBoard[tile.index] = { letter: tile.letter,
                             discovered: tile.discovered,
                             index: tile.index,
                             visible: true };

    console.log('>> setTileVisible: Updating state');
    this.setState({
      clicks: this.state.clicks,
      timeElapse: this.state.timeElapse,
      board: newBoard,
      currentTile: this.state.currentTile,
      clicksEnabled: this.state.clicksEnabled
    }, () => { if (callback) callback() });
  }

  setClicksEnabled(enabled, callback) {
    let newState = {
      clicks: this.state.clicks,
      timeElapse: this.state.timeElapse,
      board: this.state.board,
      currentTile: this.state.currentTile,
      clicksEnabled: false,
      someRandomValue: 22343
    };
    console.log('>> setClicksEnabled: Updating state');
    this.setState(newState, () => {
      console.log('>>>>> Clicks set enabled', enabled, this.state, newState);
      callback();
    });
  }
  upClicks() {
    this.setState({
      clicks: this.state.clicks + 1,
      timeElapse: this.state.timeElapse,
      board: this.state.board,
      currentTile: this.state.currentTile,
      clicksEnabled: this.state.clicksEnabled
    });
  }
  tileClicked(tile) {
    this.channel.push("guess", {"location": "say_waat"})
        .receive("ok", (res) => {
          console.log("Pushed and got response", res);
        });
    if (tile.visible || tile.discovered || !this.state.clicksEnabled) {
      return;
    }

    console.log('Tile clicked: ', tile);

    let firstTileSelected = !!this.state.currentTile;

    console.log('Clicks enabled?', !firstTileSelected, this.state);

    this.setTileVisible(tile, () => {
      console.log('First tile selected?', firstTileSelected);

      if (firstTileSelected) {
        this.setClicksEnabled(false, () => {
          console.log('First tile already selected, setting timeout',
              this.state);
          setTimeout(() => {
            this.updateState(tile, true);
          }, 1000);
          this.upClicks()
        });

      } else {
        this.updateState(tile, false, () => this.upClicks());
      }
    });
  }

  updateState(tile, afterTimeout, callback) {
    let newBoard = [ ...this.state.board ];

    let currentTile = this.state.currentTile;

    let twoTilesSelected = !!currentTile;

    if (!!currentTile) {
      let discovered = currentTile.letter === tile.letter;
      newBoard[tile.index] = { letter: tile.letter,
                               discovered: discovered,
                               index: tile.index,
                               visible: false };
      newBoard[currentTile.index] = { letter: currentTile.letter,
                                discovered: discovered,
                                index: currentTile.index,
                                visible: false };
      currentTile = undefined;

    } else {
      newBoard[tile.index] = { letter: tile.letter,
                               discovered: tile.discovered,
                               index: tile.index,
                               visible: true };
      currentTile = tile;
    }

    console.log('>> updateState: Updating state');

    this.setState({
      clicks: this.state.clicks,
      timeElapse: this.state.timeElapse,
      board: newBoard,
      currentTile: currentTile,
      clicksEnabled: true
    }, () => { if (!!callback) callback() });
    console.log('Updated state', this.state);
  }
}

function isGameOver(state) {
  for (let i = 0; i < state.board.length; i++) {
    if (!state.board[i].discovered) {
      return false;
    }
  }

  return true;
}

function getInitialGameState() {
  let items = [...VALID_LETTERS, ...VALID_LETTERS];
  let gameState = {
    board: [],
    clicks: 0,
    timeElapse: 0,
    currentTile: undefined,
    clicksEnabled: true
  }

  const itemsLength = items.length;

  for (let i = items.length - 1; i >= 0 ; i-- ) {
    gameState.board.push({
      letter: items.splice(Math.floor(Math.random()*items.length), 1)[0],
      visible: false,
      discovered: false,
      index: (itemsLength - 1) - i
    });
  }

  return gameState;
}
