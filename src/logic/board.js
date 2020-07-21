import { getListOfLetters } from './letters';

export const getTableWithLetters = (numOfRows, numOfCols, difficulty = 0) => {
  const numOfLetters = difficulty === 1 ? 15 : difficulty === 2 ? 20 : 25;
  const letters = getListOfLetters(numOfLetters, difficulty);

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

export const getDumpLetterBonus = (table, currentLocation) => {
  // get the letters
  // find first empty spaces and place the tiles
  const letters = getListOfLetters(2);

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