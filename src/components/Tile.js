import React from 'react';
import './Tile.scss';

export const Tile = (props) => {
  const { letter, id, onDragStart } = props;
  return (
    <div className="TileComponent" draggable="true" id={id} onDragStart={onDragStart}>
      {letter}
    </div>
  );
}
