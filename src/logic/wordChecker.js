import { WORDS_2 } from "../constants/words2";
import { WORDS_3 } from "../constants/words3";
import { WORDS_4 } from "../constants/words4";
import { WORDS_5 } from "../constants/words5";
import { WORDS_6 } from "../constants/words6";
import { WORDS_7 } from "../constants/words7";
import { WORDS_8 } from "../constants/words8";
import { WORDS_9 } from "../constants/words9";
import { WORDS_10 } from "../constants/words10";
import { WORDS_11 } from "../constants/words11";
import { WORDS_12 } from "../constants/words12";
import { WORDS_13 } from "../constants/words13";
import { WORDS_14 } from "../constants/words14";
import { WORDS_15 } from "../constants/words15";

// TODO - NEED TO CHECK THAT ALL WORDS ARE INTERSECTING

export const isBoardValid = (board) => {
  if (hasSoloTile(board)) {
    return {
      isValid: false, 
      reason: "🤔 Valid words need to be at least two-tiles long. Fix pls!",
      assets: []
    };
  }

  if (!areWordsConnected(board)) {
    return {
      isValid: false,
      reason: "Tiles need to be connected with each other",
      assets: []
    }
  }

  const words = [...getHorizontalWords(board), ...getVerticalWords(board)];
  const invalidWords = [];
  for (const word of words) {
    const valid = isWordValid(word)
    if (!valid) {
      invalidWords.push(word);
    }
  }

  if (invalidWords.length) {
    return {
      isValid: false,
      reason: `You have invalid words on the board`,
      assets: invalidWords
    } 
  }

  return {
    isValid: true,
    reason: '🏆 Congrats! All the words on your board check out! 👏'
  };
}

export const areAllTilesOnBoardAndConnected = (board, numOfLetters) => {
  return areAllTilesOnBoard(board, numOfLetters)
}

export const areAllTilesOnBoard = (board, numOfLetters) => {
  return getNumOfTilesOnBoard(board) === numOfLetters;
}

export const getNumOfTilesOnBoard = (board) => {
  let count = 0;
  const maxRow = board.length;
  const maxCol = board[0].length;

  for (let row = 0; row < maxRow; row++) {
    for (let col = 0; col < maxCol; col++) {
      const currentChar = board[row][col];
      if (currentChar && currentChar.length) {
        count++;
      }
    }
  }
  return count;
}

export const areWordsConnected = (board) => {
  const maxRow = board.length;
  const maxCol = board[0].length;
  const visitedNodes = new Set();
  const toVisit = [];
  // HELPER FUNCTIONS
  const getLocation = (row, col) => `${row}-${col}`;
  const getSurroundingLocations = (row, col) => {
    const final = [];
    const up = getLocation(row - 1, col);
    if (row > 0 && hasChar(row - 1, col) && !visitedNodes.has(up)) {
      final.push(up);
    }
    const left = getLocation(row, col - 1);
    if (col > 0 && hasChar(row, col - 1) && !visitedNodes.has(left)) {
      final.push(left);
    }
    const down = getLocation(row + 1, col);
    if (row !== maxRow - 1 && hasChar(row + 1, col) && !visitedNodes.has(down)) {
      final.push(down);
    }
    const right = getLocation(row, col + 1);
    if (row !== maxCol - 1 && hasChar(row, col + 1) && !visitedNodes.has(right)) {
      final.push(right);
    }
    return final;
  }
  
  const getLocationRowCol = (location) => {
    const [row, col] = location.toString().split("-");
    return [parseInt(row), parseInt(col)];
  }
  const hasChar = (row, col) => {
    const currentChar = board[row][col];
    return !!currentChar;
  }

  // find the first letter available to start the graph search
  loop1:
  for (let row = 0; row < maxRow; row++) {
    for (let col = 0; col < maxCol; col++) {
      if (hasChar(row, col)) {
        const location = getLocation(row, col);
        visitedNodes.add(location);
        const neighbors = getSurroundingLocations(row, col);
        // get the starter batch of neighbors
        toVisit.push(...neighbors);
        break loop1;
      }
    }
  }
  
  // graph search; adds all neighboring tiles to visited nodes
  while (toVisit.length > 0) {
    const currentLocation = toVisit.pop();
    const [row, col] = getLocationRowCol(currentLocation);
    if (visitedNodes.has(currentLocation)) {
      continue;
    } else if (hasChar(row, col)) {
      visitedNodes.add(currentLocation);
      const currentNeighbors = getSurroundingLocations(row, col);
      toVisit.push(...currentNeighbors);
    }
  }

  // find any other stray stuff that wasn't caught in the first round
  for (let row = 0; row < maxRow; row++) {
    for (let col = 0; col < maxCol; col++) {
      const current = getLocation(row, col);
      if (hasChar(row, col) && !visitedNodes.has(current)) {
        return false;
      }
    }
  }

  return true;
}

export const isWordValid = (word) => {
  const formatWord = word.toLowerCase();
  
  switch (word.length) {
    case(2): return WORDS_2.has(formatWord);
    case(3): return WORDS_3.has(formatWord);
    case(4): return WORDS_4.has(formatWord);
    case(5): return WORDS_5.has(formatWord);
    case(6): return WORDS_6.has(formatWord);
    case(7): return WORDS_7.has(formatWord);
    case(8): return WORDS_8.has(formatWord);
    case(9): return WORDS_9.has(formatWord);
    case(10): return WORDS_10.has(formatWord);
    case(11): return WORDS_11.has(formatWord);
    case(12): return WORDS_12.has(formatWord);
    case(13): return WORDS_13.has(formatWord);
    case(14): return WORDS_14.has(formatWord);
    case(15): return WORDS_15.has(formatWord);
    default: return false;
  }
}

export const getHorizontalWords = (board) => {
  const horizontalWords = [];

  const maxRow = board.length;
  const maxCol = board[0].length;

  for (let row = 0; row < maxRow; row++) {
    for (let col = 0; col < maxCol; col++) {
      const currentChar = board[row][col];
      if (!currentChar) {
        // nothing here; carry on
        continue;
      }
      const currentWord = [];

      let tempCol = col + 1;
      while (tempCol < maxCol) {
        const tempChar = board[row][tempCol];
        if (!tempChar) {
          // nothing here; break out of while loop
          break;
        } else if (tempChar && tempCol - 1 === col) {
          // there IS a next letter; this is not a lone letter
          currentWord.push(currentChar);
        }
        currentWord.push(tempChar);
        tempCol++;
      }

      // add the current word to final list of words
      if (currentWord.length) {
        horizontalWords.push(currentWord.join(""));
        col = tempCol;
      }
    }
  }

  return horizontalWords;
}

export const getVerticalWords = (board) => {
  const verticalWords = [];

  const maxRow = board.length;
  const maxCol = board[0].length;

  for (let col = 0; col < maxCol; col++) {
    for (let row = 0; row < maxRow; row++) {
      const currentChar = board[row][col];
      if (!currentChar) {
        // nothing here; carry on
        continue;
      }
      const currentWord = [];

      let tempRow = row + 1;
      while (tempRow < maxRow) {
        const tempChar = board[tempRow][col];
        if (!tempChar) {
          // nothing here; break out of while loop
          break;
        } else if (tempChar && tempRow - 1 === row) {
          // there IS a next letter; this is not a lone letter
          currentWord.push(currentChar);
        }
        currentWord.push(tempChar);
        tempRow++;
      }

      // add the current word to final list of words
      if (currentWord.length) {
        verticalWords.push(currentWord.join(""));
        row = tempRow;
      }
    }
  }

  return verticalWords;
}

export const hasSoloTile = (board) => {
  const maxRow = board.length;
  const maxCol = board[0].length;

  for (const rowIndex in board) {
    for(const colIndex in board[rowIndex]) {
      const currentChar = board[rowIndex][colIndex];
      if (!currentChar || !currentChar.length) {
        // nothing here; continue
        continue;
      }

      const rowNum = parseInt(rowIndex);
      const colNum = parseInt(colIndex);

      const isEmpty = {
        left: false,
        right: false,
        up: false,
        down: false
      };

      // check left
      if (colNum > 0) {
        const leftCol = colNum - 1;
        const leftChar = board[rowNum][leftCol];
        if (!leftChar || !leftChar.length) {
          isEmpty.left = true;
        }
      } else {
        isEmpty.left = true;
      }

      // check right
      if (colNum < maxCol - 1) {
        const rightCol = colNum + 1;
        const rightChar = board[rowNum][rightCol];
        if (!rightChar || !rightChar.length) {
          isEmpty.right = true;
        }
      } else {
        isEmpty.right = true;
      }

      // check up
      if (rowNum > 0) {
        const upRow = rowNum - 1;
        const upChar = board[upRow][colNum];
        if (!upChar || !upChar.length) {
          isEmpty.up = true;
        }
      } else {
        isEmpty.up = true;
      }

      // check down
      if (rowNum < maxRow - 1) {
        const downRow = rowNum + 1;
        const downChar = board[downRow][colNum];
        if (!downChar || !downChar.length) {
          isEmpty.down = true;
        }
      } else {
        isEmpty.down = true;
      }

      // check isEmpty values
      const theTruth = Object.values(isEmpty).filter((val) => !!val);
      if (theTruth.length === 4) {
        return true;
      }
    }
  }
  return false;
}