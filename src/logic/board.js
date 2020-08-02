import { getListOfLetters } from './letters';

const Greetings = [
  ["H", "I", "I", "I", "I"],
  ["H", "E", "L", "L", "O"],
  ["W", "E", "L", "C", "O", "M", "E"],
  ["W", "H", "A", "T", "S", "U", "P"]
]

export const getTableWithLetters = (numOfRows, numOfCols, difficulty = 0) => {
  let numOfLetters;
  let letters;
  if (difficulty === 0) {
    letters = Greetings[Math.floor(Math.random() * Greetings.length)];
  } else {
    numOfLetters = difficulty === 1 ? 15 : difficulty === 2 ? 20 : 25;
    letters = getListOfLetters(numOfLetters, difficulty);
  }
  

  const final = [];
  let count = 0;
  for (let row = 0; row < numOfRows; row++) {
    const row = [];
    for (let col = 0; col < numOfCols; col++) {
      if (count !== numOfLetters) {
        row.push(letters[count])
        count++;
      } else {
        row.push(null);
      }
    }
    final.push(row);
  }
  return final;
}


export const getRowColNumbers = (locationString) => {
  const [row, col] = locationString.split("-");
  return [parseInt(row), parseInt(col)];
}

export const getDumpLetterBonus = (table, currentLocation, gameLevel) => {
  // get the letters
  // find first empty spaces and place the tiles
  const letters = getListOfLetters(gameLevel);

  let newTable = [...table];
  for (const row in newTable) {
    for (const col in row) {
      if (!newTable[row][col]) {
        const letter = letters.pop();
        newTable[row][col] = letter;
        if (!letters.length) {
          break;
        }
      }
    }
  }

  // remove the dumped letter
  const [row, col] = getRowColNumbers(currentLocation);
  newTable[row][col] = null;

  return newTable;
}