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
  for (let i of boardArray) {
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
  return {"row" : row, "col" : col}
}

function setBoardCell(board, letter, row, col) {
  const copy = board.slice()
  const size = Math.sqrt(board.length);
  copy[row * size + col] = letter;
  return copy; //error fixed
}

function algebraicToRowCol(algebraicNotation) {
  const maxSize = 26;
  const row = algebraicNotation.charCodeAt(0) - 65;
  const col = parseInt(algebraicNotation.slice(1), 10) - 1;
  if (0 <= row && row < maxSize && 0 <= col && col < maxSize) {
    return {"row" : row, "col" : col}
  }
  else {
    return undefined
  }
}

function placeLetter(board, letter, algebraicNotation) {
  const size = Math.sqrt(board.length)
  const copy = board.slice()
  const row = algebraicNotation.charCodeAt(0) - 65;
  const col = parseInt(algebraicNotation.slice(1), 10) - 1;
  copy[row * size + col] = letter;
  return copy;

}

function getWinner(board) {

}

function isBoardFull(board) {

}

function isValidMove(board, algebraicNotation) {

}




export {
  generateBoard
}

