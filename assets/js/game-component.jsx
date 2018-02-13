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
                this.setState(toState(view));
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
                    this.state.loading
                        ?
                        <div>
                            <h2>Loading...</h2>
                        </div>
                        :
                        isGameOver(this.state)
                            ?
                            <div>
                                <h2>Game over</h2>
                                <h3>Score: <b>{this.state.clicks}</b> <small>(less is better)</small></h3>
                            </div>
                            :
                            <div>
                                <div>
                                    <h2>Playing...</h2>
                                    <h3>Clicks: {this.state.clicks}</h3>
                                </div>
                                <div>
                                    <Board board={ this.state.board }
                                           clicksEnabled={ this.state.clicksEnabled }
                                           tileClicked={ (tile) => this.tileClicked(tile) }/>
                                </div>
                            </div>

                }
            </div>
        </div>)
    }

    resetGame() {
        this.setState(getInitialGameState());
    }

    setClicksEnabled(enabled, callback) {
        let newState = {
            clicks: this.state.clicks,
            timeElapse: this.state.timeElapse,
            board: this.state.board,
            currentTile: this.state.currentTile,
            clicksEnabled: enabled
        };
        console.log('>> setClicksEnabled: Updating state', enabled);
        this.setState(newState, () => {
            console.log('>>>>> Clicks set enabled', enabled, this.state, newState);
            if (!!callback) callback();
        });
    }

    tileClicked(tile) {
        if (!this.state.clicksEnabled) {
            return;
        }
        console.log("Pushing", tile);
        this.setClicksEnabled(false, () => {
            this.channel.push("guess", {"guess": tile.index})
                .receive("ok", view => {
                    console.log("Pushed and got response", view);
                    this.setState(toState(view, this.state), () => {
                        if (!isNaN(this.state.guess1) && this.state.guess1 != null
                            && !isNaN(this.state.guess2) && this.state.guess2 != null) {
                            console.log("Resetting guess", this.state);
                            setTimeout(() => {
                                this.channel.push("guess", {"guess": null}).receive("ok", v => {
                                    this.setClicksEnabled(true, () => {
                                        this.setState(toState(v))
                                    });
                                })
                            }, 1000)
                        } else {
                            this.setClicksEnabled(true)
                        }
                    });

                });
        });
    }

    finishedLoading() {
        this.setClicksEnabled(true);
    }
}

function isGameOver(state) {
    if (!state.board || state.loading) {
        return false;
    }
    for (let i = 0; i < state.board.length; i++) {
        if (!state.board[i].discovered) {
            return false;
        }
    }

    return true;
}

function getInitialGameState() {
    return {
        loading: true
    }
}

function toTiles(skeleton) {
    const tiles = [];

    for (let i = 0;  i < skeleton.length ; i++) {
        switch (skeleton[i]) {
            case '*':
                tiles.push({
                   visible: false,
                   discovered: false,
                    index: i
                });
                break;
            case '#':
                tiles.push({
                    visible: false,
                    discovered: true,
                    index: i
                });
                break;
            default:
                tiles.push({
                    visible: true,
                    discovered: false,
                    letter: skeleton[i],
                    index: i
                });
                break;
        }
    }

    return tiles;
}

function toState(view, oldState) {
    return {
        board: toTiles(view.game.skeleton),
        clicks: view.game.clicks,
        clicksEnabled: !!oldState ? oldState.clicksEnabled : true,
        guess1: view.game.guess1,
        guess2: view.game.guess2,
        loading: false
    };

}