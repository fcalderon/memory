// the tile component

import React from 'react';

function tileClasses(tile, clicksEnabled) {
    let classes = clicksEnabled ? 'clickable' : 'disabled';

    if (tile.visible) {
        classes = 'tile--visible';
    } else if (tile.discovered) {
        classes = ' tile--discovered';
    }

    return classes;
}

export const Tile = (props) => {
    return (
        <div className={"tile "
        + tileClasses(props.tile, props.clicksEnabled) }>
            <p className="tile__letter">
                { props.tile.visible ? props.tile.letter : '' }
            </p>
        </div>
    );
};