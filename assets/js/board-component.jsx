// the board component
import React from 'react';
import ReactDOM from 'react-dom';
import {Tile} from './tile-component.jsx';

export const VALID_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export class Board extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
  }

  handleClick(tile) {
    console.log('Clicked', tile);
    this.props.tileClicked(tile)
  }
  renderBoard(board) {
    let items = [];
    for (let i = 0; i < board.length ; i++) {
      items.push(
          <div className="col-3" key={i} onClick={() => this.handleClick(board[i])}>
            <Tile tile={board[i]}/>
          </div>
      );
    }
    return items;
  }

  render() {
    return (
    <div>
      <div className="row">
        { this.renderBoard(this.props.board) }
      </div>
    </div>
    );
  }
}
