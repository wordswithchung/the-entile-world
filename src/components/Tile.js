import React from 'react';
import './Tile.scss';

export const Tile = (props) => {
  const { letter, id, onDragStart } = props;
  const isVowel = 'AEIOU'.includes(letter);
  const isHardConsonant = 'JKQVXZ'.includes(letter);
  return (
    <div className={`Tile-Component ${isVowel ? 'vowel' : isHardConsonant ? 'hard' : 'easy'}`} draggable="true" id={id} onDragStart={onDragStart}>
      {letter}
    </div>
  );
}
