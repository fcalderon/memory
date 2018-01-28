import React from 'react';
import ReactDOM from 'react-dom';
import { Board } from './board-component.jsx';

export const VALID_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export class Game extends React.Component {
  constructor(){
    super();
    this.state = getInitialGameState();
  }

  render(){
    return (<div>
      <h1>Game</h1>
      <div>
        <Board board={ this.state.board } tileClicked={ (tile) => this.tileClicked(tile) }/>
      </div>
    </div>)
  }

  setTileVisible(tile) {
    let newBoard = [ ...this.state.board ];

    newBoard[tile.index] = { letter: tile.letter,
                             discovered: tile.discovered,
                             index: tile.index,
                             visible: true };

    this.setState({
      clicks: this.state.clicks,
      timeElapse: this.state.timeElapse,
      board: newBoard,
      currentTile: this.state.currentTile
    });
  }


  tileClicked(tile) {
    console.log('Tile clicked: ', tile);
    this.setTileVisible(tile);
    setTimeout(() => {
      this.updateState(tile)
    }, 1000);
  }

  updateState(tile) {
    let newBoard = [ ...this.state.board ];

    let newClicks = this.state.clicks + 1;

    let currentTile = this.state.currentTile;

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

    this.setState({
      clicks: newClicks,
      timeElapse: this.state.timeElapse,
      board: newBoard,
      currentTile: currentTile
    });
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
    currentTile: undefined

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
