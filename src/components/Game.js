import React, { useState } from 'react';
import { getTableWithLetters, getRowColNumbers, getDumpLetterBonus } from '../logic/board';
import { isBoardValid } from "../logic/wordChecker";
import Confetti from 'react-dom-confetti';
import './Game.scss';

const config = {
  angle: "151",
  spread: "360",
  startVelocity: "27",
  elementCount: "152",
  dragFriction: "0.05",
  duration: "8140",
  stagger: "6",
  width: "23px",
  height: "10px",
  perspective: "982px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};

export const Game = () => {
  const isMobile = window.innerWidth < 400;
  const numCol = isMobile ? window.innerWidth / 40 : Math.min(window.innerWidth / 30, 15);
  const [table, setTable] = useState(getTableWithLetters(15, numCol, 2));
  const [isStartingNewGame, setStartingNewGame] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [invalidResult, setInvalidresult] = useState(null);
  // info is an array with the [location, letter]
  const [currentInfo, setCurrentInfo] = useState(null);

  const newGameClickHandler = (gameLevel) => {
    setTable(getTableWithLetters(15, numCol, gameLevel));
    // reset all the states
    setStartingNewGame(false);
    setCurrentInfo(null);
    setIsGameOver(false);
    setInvalidresult(null);
  }

  const handleThatTrash = () => {
    if (currentInfo) {
      const newTable = getDumpLetterBonus(table, currentInfo[0]);
      setTable(newTable);
      setCurrentInfo(null);
    }
  }

  const checkBoard = () => {
    const result = isBoardValid(table);
    if (result.isValid) {
      setInvalidresult(null);
      setIsGameOver(true);
      setStartingNewGame(true);
    } else {
      setInvalidresult(result);
    }
  }

  const handleTileClick = (event) => {
    const potentialLetter = event.currentTarget.innerText;
    const potentialLocation = event.currentTarget.id;
    const [potentialRow, potentialCol] = getRowColNumbers(potentialLocation);

    if (currentInfo && !potentialLetter) {
      const [currentLocation, currentLetter] = currentInfo;
      const [currentRow, currentCol] = getRowColNumbers(currentLocation);
      if (currentLocation === potentialLocation) {
        return;
      }
      // user already previously clicked on a tile with a letter
      // now we are moving the tile to this next location
      let newTable = [...table];
      // move the current letter to the new location
      newTable[potentialRow][potentialCol] = currentLetter;
      // delete the current letter from its current location
      newTable[currentRow][currentCol] = null;
      setTable(newTable);
      // reset the currentInfo state
      setCurrentInfo(null)
    } else if (currentInfo && potentialLetter) {
      // they're trying to move to a tile that already has a letter
      // notify them
      setCurrentInfo(null);
    } else if (!currentInfo && potentialLetter) {
      setCurrentInfo([potentialLocation, potentialLetter]);
    } else {
      // do nothing since user clicked on empty square
      setCurrentInfo(null);
    } 
  }

  const columnsContent = (rowNumber, tiles, handleTileClick) => {
    const hasTileClass = (tile) => {
      const vowels = ['A', 'E', 'I', 'O', 'U'];
      const hardConsonants = ['J', 'C', 'K', 'Q', 'V', 'X', 'Z'];
      if (vowels.includes(tile)) {
        return 'has-tile__vowel';
      } else if (hardConsonants.includes(tile)) {
        return 'has_tile__hard_consonant';
      } else if (tile) {
        return 'has-tile';
      } else {
        return '';
      }
    }
    return (
      tiles.map((tile, columnIndex) => (
        <td
          key={Math.random()}
          id={`${rowNumber}-${columnIndex}`}
          className={`game--board--tile ${hasTileClass(tile)} ${currentInfo && currentInfo[0] === rowNumber + '-' + columnIndex ? 'currently-selected' : ''}`}
          onClick={handleTileClick}
        >
          {tile}
        </td>
      ))
    )
  }

  return (
    <div className="game">
      <header className="game--name">
        Entile World
      </header>
      <header className="game--header">
        {!isStartingNewGame && (
          <div className="game--header__buttons">
            <button className="secondary" onClick={() => setStartingNewGame(true)}>New Game</button>
            <button id="checkboard-button" onClick={checkBoard}>Check Board</button>
          </div>
        )}
        {isStartingNewGame && (
          <div className="game--header__buttons new-game">
            <button onClick={() => newGameClickHandler(1)}>Easy</button>
            <button onClick={() => newGameClickHandler(2)}>Medium</button>
            <button onClick={() => newGameClickHandler(3)}>Hard</button>
            <button className="secondary" onClick={() => setStartingNewGame(false)}>Cancel</button>
          </div>
        )}
        <span 
          role="img" 
          aria-label="wastebasket emoji" 
          className="game--header__garbage"
          onClick={handleThatTrash}
        >
          🗑️
        </span>
      </header>
      {
        invalidResult && (
        <div className="game--invalid-result">
          {invalidResult.reason}<br />
          {invalidResult.assets && invalidResult.assets.join(", ")}
        </div>
        )
      }
      {
        isGameOver &&  (
          <div className="game--game-over">
            Congrats! You won! <span role="img" aria-label="confetti tada emoji">🎉</span>
          </div>
        )
      }
      <div className="game--confetti">
        <Confetti active={isGameOver} config={config} />
      </div>
      <table className="game--board__table">
        <tbody>
          {table.map((row, index) => (
            <tr 
              key={`row-${index}`} 
              className="game--board__table--row"
            >
              {columnsContent(index, row, handleTileClick)}
            </tr>
          ))}
        </tbody>
      </table>
      <footer className="game--footer">
        Game created by Chung Nguyen in 2020. For feedback or comments, please email first name, last name @gmail :)
      </footer>
    </div>
  )
}