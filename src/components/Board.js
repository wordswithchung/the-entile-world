import React, { useState } from 'react';
import { getListOfLetters } from '../logic/letters';
import { isBoardValid } from "../logic/wordChecker";
import { Menu } from './Menu';
import './Board.scss';

// HELPERS
const getColumnLengthArray = () => {
  const squareSideSize = 45;
  const numOfColumns = Math.floor((window.innerWidth * 0.75) / squareSideSize);
  return getList(numOfColumns);
}

const getRowLengthArray = () => {
  // const squareSideSize = 70;
  const numOfRows = 10; //Math.floor(window.innerHeight / squareSideSize);
  return getList(numOfRows);
}

const getList = (size) => {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(i)
  }
  return arr;
}

// const tileDrag = (event) => {
//   event.dataTransfer.setData("text", event.target.id);
// }

const getStarterTileBoard = (numRows, numColumns) => {
  const columns = [];
  for (let i = 0; i < numColumns; i++) {
    columns.push(null);
  }
  const board = [];
  for (let i = 0; i < numRows; i++) {
    board.push([...columns]);
  }
  return board;
}

/**
 * If the tile is already on the board, this will return the
 * location [row, col]. Otherwise, it returns null;
 */
const getPreviousLocation = (board, letterId) => {
  for (const row in board) {
    for (const col in board[row]) {
      const current = board[row][col];
      if (!!current && current[0] === letterId) {
        return [row, col];
      }
    }
  }    
  return null;
}

// COMPONENT
export const Board = () => {
  const [letters, setLetters] = useState(getListOfLetters(25));
  const rows = getRowLengthArray();
  const columns = getColumnLengthArray();
  const tileStarter = getStarterTileBoard(rows.length, columns.length);
  const [tilePlacement, setTilePlacement] = useState(tileStarter);
  // const [validity, setValidity] = useState(null);
  
  const tableDropHandler = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const child = document.getElementById(data);
    const tileLocation = event.target.id;
    
    if (!isTileOccupied(tileLocation)) {
      // only allow tile in field if it is empty
      event.target.appendChild(child);
      const letter = child.textContent;
      const letterId = child.id;
      updateTilePlacement(tileLocation, letter, letterId);
    }
  }

  // location looks like 0-14
  // letter should be the tile letter
  // letterId is the tile Id
  const updateTilePlacement = (tileLocation, letter, letterId) => {
    const [ row, column ] = tileLocation.split("-");

    const rowNumber = parseInt(row);
    const colNumber = parseInt(column);
    let tiles = tilePlacement;
    // check to see if moving existing tile
    const previousLocation = getPreviousLocation(tiles, letterId);
    if (!!previousLocation) {
      const [row, col] = previousLocation;
      tiles[row][col] = [];
    }
    tiles[rowNumber][colNumber] = [letterId, letter];
    setTilePlacement(tiles);
  }

  const isTileOccupied = (tileLocation) => {
    const [ row, column ] = tileLocation.split("-");
    const tile = tilePlacement[row][column];
    return !!tile && !!tile.length;
  }

  const allowDrop = (event) => {
    event.preventDefault();
  }

  const checkWords = () => {
    const results = isBoardValid(tilePlacement);
    console.log('results', results)
    // setValidity(results);
  }

  const columnsContent = (rowNumber, columnsArray) => {
    return (
      columnsArray.map((num, columnIndex) => (
        <td 
          key={num} 
          id={`${rowNumber}-${num}`}
          onDrop={tableDropHandler}
          onDragOver={allowDrop}
        />
      ))
    )
  }

  const garbageDrop = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const child = document.getElementById(data);
    if (child) {
      event.target.appendChild(child);
      event.target.removeChild(child);
    }
    
    const currentLetters = [...letters, ...getListOfLetters(2)];
    setLetters(currentLetters);
  }

  const newGameClickHandler = (gameLevel) => {
    const numOfLetters = gameLevel === 1 ? 15 : gameLevel === 3 ? 30 : 20;
    setLetters(getListOfLetters(numOfLetters, gameLevel));
  }
  
  return (
    <div className="Board">
      <div className="Board-headerSection">
        <div className="Board-menu">
          <Menu onClickHandler={newGameClickHandler} />
        </div>
        <button className="table-component--button" onClick={checkWords}>Check Game</button>
        <div 
          className="Board-trash" 
          onDrop={garbageDrop}
          onDragOver={allowDrop}>
          <span role="img" aria-label="garbage can emoji">🗑️</span>
        </div>
      </div>
      {/* <div className="Board-tiles">
        {letters.map((letter, index) => <Tile letter={letter} key={index} id={Math.random() * 100} onDragStart={tileDrag}/>)}
      </div> */}

      <div className="table-component">
        {/* <div className="table-component--header">
          {validity && <div className={`table-component--validity table-component--validity__${validity.isValid}`}>{validity.reason}</div> }
          <button className="table-component--button" onClick={checkWords}>Check Words</button>
          
        </div> */}
        <table className="table-component--table">
          <tbody id="gameTableBody">
            {rows.map((rowNum) => (
              <tr key={rowNum}>
                {columnsContent(rowNum, columns)}
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}