import React from 'react';
import { Tile } from './Tile'
import { LetterCalculator } from '../logic/letterCalculator';
import './Board.scss';

const getRandomLetters = () => {
  const letterCalculator = new LetterCalculator();
  return letterCalculator.getListOfLetters(25);
}

const getColumnLengthArray = () => {
  const squareSideSize = 70;
  const numOfColumns = Math.floor(window.innerWidth / squareSideSize);
  return getList(numOfColumns);
}

const getRowLengthArray = () => {
  const squareSideSize = 70;
  const numOfRows = Math.floor(window.innerHeight / squareSideSize);
  return getList(numOfRows);
}

const getList = (size) => {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(i)
  }
  return arr;
}

const allowDrop = (event) => {
  event.preventDefault();
}

const drag = (event) => {
  console.log('event.target.id in drag', event.target.id)
  event.dataTransfer.setData("text", event.target.id);
}

const drop = (event) => {
  console.log('event', event)
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  console.log('data', data)
  const elle = document.getElementById(data);
  console.log('elle', elle)
  event.target.appendChild(document.getElementById(data));
}

const Board = () => {
  const letters = getRandomLetters();
  const rows = getRowLengthArray();
  const columns = getColumnLengthArray();
  return (
    <div className="Board">
      <table>
        <tbody>
          {rows.map((rowNum) => (
            <tr key={rowNum}>{
              columns.map((num) => (
                <td 
                  key={num} 
                  id={Math.random()}
                  onDrop={drop}
                  onDragOver={allowDrop}
                >
                </td>
              ))
            }</tr>))}
        </tbody>
      </table>
      <br></br>
      <div className="Board-tiles">
        {letters.map((letter, index) => <Tile letter={letter} key={index} id={Math.random() * 100} onDragStart={drag}/>)}
      </div>
    </div>
  );
}

export default Board;