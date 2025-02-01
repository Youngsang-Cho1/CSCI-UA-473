// tic-tac-toe.js
function repeat(initVal, length) {
  return Array(length).fill(initVal);
}

function generateBoard(rows, cols, initialValue) {
  const blankValue = initialValue || " ";
  return repeat(blankValue, rows * cols);
}

function boardFromString(s) {
  const validChar = "XO ";
  const boardArray = s.split("");
  for (const i of boardArray) {
    if (!validChar.includes(i)) {
      return null;
    }
  }
  const size = Math.sqrt(s.length);
  if (!Number.isInteger(size)) {
    return null;
  }
  return boardArray;
  
}

function rowColToIndex(board, row, col) {
  const size = Math.sqrt(board.length);
  return row * size + col;

}

function indexToRowCol(board, i) {
  const size = Math.sqrt(board.length);
  const row = Math.floor(i / size);
  const col = i % size;
  return {"row" : row, "col" : col};
}

function indexToAlgebraic(board, i) {
  const size = Math.sqrt(board.length);
  const row = Math.floor(i/size);
  const col = i % size;
  const algebraicNotation = String.fromCharCode(row+65) + (col+1);
  return algebraicNotation;
}


function setBoardCell(board, letter, row, col) {
  const copy = board.slice();
  const size = Math.sqrt(board.length);
  copy[row * size + col] = letter;
  return copy; 
}

function algebraicToRowCol(algebraicNotation) {
  const maxSize = 26;
  if (algebraicNotation[0] < 'A' || algebraicNotation[0] > 'Z' || !(/^\d+$/.test(algebraicNotation[1])) ){
    return undefined;
  }
  const row = algebraicNotation.charCodeAt(0) - 65;
  const col = parseInt(algebraicNotation.slice(1), 10) - 1;
  if (0 <= col && col < maxSize) {
    return {"row" : row, "col" : col};
  }
  return undefined;
}

function placeLetter(board, letter, algebraicNotation) {
  const size = Math.sqrt(board.length);
  const copy = board.slice();
  const row = algebraicNotation.charCodeAt(0) - 65;
  const col = parseInt(algebraicNotation.slice(1), 10) - 1;
  copy[row * size + col] = letter;
  return copy;

}

function getWinner(board) {
  const size = Math.sqrt(board.length);
  let rowStore = [];
  let colStore = [];
  let leftDiagonalStore = [];
  let rightDiagonalStore = [];
  let count = 0;

  // checking row
  for (let i = 0; i < size; i++) {
    rowStore = board.slice(i * size, (i + 1) * size);
    for (const j of rowStore) {
      if (rowStore[0] !== " " && rowStore[0] === j) {
        count += 1;
      }
    }
    if (count === size) {
      return rowStore[0];
    }
    count = 0;
  }

  //checking column
  for (let i = 0; i < size; i++) {
    colStore = [];
    for (let j = 0; j < size; j++) {
      colStore.push(board[j * size + i]);
    }
    for (let j of colStore) {
      if (colStore [0] !== " " && colStore[0] === j) {
        count += 1;
      }
    }
    if (count === size) {
      return colStore[0];
    }
    count = 0;
  }

  //checking left diagonal
  for (let i = 0; i < size; i++) {
    leftDiagonalStore.push(board[i * size + i]);
  }
  for (let j of leftDiagonalStore) {
    if (leftDiagonalStore [0] !== " " && leftDiagonalStore[0] === j) {
      count += 1;
    }
    if (count === size) {
      return leftDiagonalStore[0];
    }
  }
  count = 0;
  leftDiagonalStore = [];

  //checking right diagonal
  for (let i = 1; i <= size; i++) {
    rightDiagonalStore.push(board[i * size - i]);
  }
  /*
   0 1 2        0 1 2 3
   3 4 5        4 5 6 7
   6 7 8        8 9 10 11
                12 13 14 15
  */
  for (let j of rightDiagonalStore) {
    if (rightDiagonalStore[0] !== " " && rightDiagonalStore[0] === j) {
      count += 1;
    }
    if (count === size) {
      return rightDiagonalStore[0];
    }
  }
  count = 0;
  rightDiagonalStore = [];

  return undefined;
}

function isBoardFull(board) {
  for (let i of board) {
    if (i === " ") {
      return false;
    }
  }
  return true;

}

function isValidMove(board, algebraicNotation) {
  const size = Math.sqrt(board.length);
  const isValid = algebraicToRowCol(algebraicNotation);
  const row = algebraicToRowCol(algebraicNotation)["row"];
  const col = algebraicToRowCol(algebraicNotation)["col"];
  if (isValid === undefined) {
    return false;
  }
  if (row < 0 || row >= size || col < 0 || col >= size) {
    return false;
  }
  if (board[row * size + col] !== " ") {
    return false;
  }
  return true;
}

export {
  generateBoard,
  boardFromString,
  rowColToIndex,
  indexToRowCol,
  setBoardCell,
  algebraicToRowCol,
  placeLetter,
  getWinner,
  isBoardFull,
  isValidMove,
  indexToAlgebraic
};

