// the tile component

import React from 'react';
import ReactDOM from 'react-dom';

export class Tile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="tile">
        <p>{ this.props.tile.letter }</p>
        <p>{ this.props.tile.visible ? 'Visible' : 'Not visible'}</p>
        <p>{ this.props.tile.discovered ? 'Discovered' : 'Not discovered' }</p>
        <p>{ this.props.tile.index }</p>
      </div>
    );
  }
}
