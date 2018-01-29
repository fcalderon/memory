// the tile component

import React from 'react';
import ReactDOM from 'react-dom';

export class Tile extends React.Component {
  constructor(props) {
    super(props);
  }

  tileClasses(tile, clicksEnabled) {
    let classes = clicksEnabled ? 'clickable' : 'disabled';

    if (tile.visible) {
       classes = 'tile--visible';
    } else if (tile.discovered) {
       classes = ' tile--discovered';
    }

    return classes;
  }

  render() {
    return (
      <div className={"tile "
          + this.tileClasses(this.props.tile, this.props.clicksEnabled) }>
        <p className="tile__letter">
        { this.props.tile.visible ? this.props.tile.letter : '' }
        </p>
      </div>
    );
  }
}
