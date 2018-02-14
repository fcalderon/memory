// the board component
import React from 'react';
import ReactDOM from 'react-dom';
import {Tile} from './tile-component.jsx';

export const VALID_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function handleClick(tile, props) {
    props.tileClicked(tile);
}

function renderBoard(props) {
    const board = props.board;

    let items = [];

    for (let i = 0; i < board.length ; i++) {
        items.push(
            <div className="col-3" key={i} onClick={() => handleClick(board[i], props)}>
                <Tile tile={board[i]} clicksEnabled={props.clicksEnabled}/>
            </div>
        );
    }

    return items;
}


export const Board = (props) => {
    console.log('Board props', props);

    return (
        <div>
            <div className="row">
                { renderBoard(props) }
            </div>
        </div>
    );
};
