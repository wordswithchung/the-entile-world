import React, { useState, useEffect } from 'react';
import { getTableWithLetters, getRowColNumbers, getDumpLetterBonus } from '../logic/board';
import { isBoardValid } from "../logic/wordChecker";
import ConfettiGenerator from "confetti-js";
import { Modal } from 'react-responsive-modal';
import './Game.scss';

const confettiSettings = { 
  target: 'confetti-holder',
  size: 1.9,
  animate: true,
  props:["circle","square","triangle","line"],
  clock: "25",
  rotate: true,
  max: 200,
  colors: [[26,4,0],[175,0,42],[0,72,86],[255,126,0],[245,245,245]]
};

export const Game = () => {
  const isMobile = window.innerWidth < 400;
  const numCol = isMobile ? window.innerWidth / 40 : Math.min(window.innerWidth / 30, 15);
  const [table, setTable] = useState(getTableWithLetters(15, numCol));
  const [isStartingNewGame, setStartingNewGame] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [confetti, setConfetti] = useState(null);
  const [invalidResult, setInvalidresult] = useState(null);
  // info is an array with the [location, letter]
  const [currentInfo, setCurrentInfo] = useState(null);

  useEffect(() => {
    setConfetti(new ConfettiGenerator(confettiSettings));
  }, [])

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
      if (confetti) {
        confetti.render();
      }
      setIsGameOver(true);
    } else {
      setInvalidresult(result);
    }
  }

  const closeModal = () => {
    setIsGameOver(false);
    if (confetti) {
      confetti.clear();
      setConfetti(new ConfettiGenerator(confettiSettings));
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
      <canvas id="confetti-holder" className={`${isGameOver && 'game-over'}`}></canvas>
      <header className="game--header">
        {!isStartingNewGame && (
          <div className="game--header__buttons">
            <button onClick={() => setStartingNewGame(true)}>New Game</button>
            <button onClick={checkBoard}>Check Board</button>
          </div>
        )}
        {isStartingNewGame && (
          <div className="game--header__buttons">
            <button onClick={() => newGameClickHandler(1)}>Easy</button>
            <button onClick={() => newGameClickHandler(2)}>Medium</button>
            <button onClick={() => newGameClickHandler(3)}>Hard</button>
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
      <table className="game--board__table">
        <tbody>
          {table.map((row, index) => (
            <tr key={`row-${index}`}>
              {columnsContent(index, row, handleTileClick)}
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={isGameOver} onClose={closeModal} center classNames={{overlay: 'custom-overlay'}}>
        <h2>Congrats on winning!</h2>
        <p>Want to start a new game?</p>
        <div className="game--header__buttons">
          <button onClick={() => {
            newGameClickHandler(1);
            closeModal();
          }}>Easy</button>
          <button onClick={() => {
            newGameClickHandler(2);
            closeModal();
          }}>Medium</button>
          <button onClick={() =>{
            newGameClickHandler(3);
            closeModal();
          }}>Hard</button>
        </div>
      </Modal>
    </div>
  )
}