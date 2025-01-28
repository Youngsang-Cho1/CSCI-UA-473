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
  for (i of boardArray) {
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
  const copy = board[0, -1];
  const size = Math.sqrt(board.length);
  board[row * size + col] = letter;
  return board;
}

function algebraicToRowCol(algebraicNotation) {
  

}

function placeLetter(board, letter, algebraicNotation) {

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

