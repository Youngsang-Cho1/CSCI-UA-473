import * as tic from './src/tic-tac-toe.js';
import { question } from 'readline-sync';
import fs from 'fs';

function userMove(board) {
    while (true) {
        const move = question("What's your move? \n> ");
        if (tic.isValidMove(board, move)) {
            return move;
        }
        console.log("Your move must be in a correct format, and it must specify an existing empty cell!");
    }
}

function computerMove(board, computerMoves) {
    const store = [];
    
    if (computerMoves.length > 0) {
        return computerMoves.shift();
    } else {
        for (let i = 0; i < board.length; i++) {
            if (board[i] === " ") {
                store.push(i);
            }
        }
        const randomIndex = Math.floor(Math.random() * store.length);
        return tic.indexToAlgebraic(board, store[randomIndex]);
    }
}

function printBoard(board) {
    const size = Math.sqrt(board.length);
    let store = "     ";

    for (let idx = 0; idx < size; idx++) {
        store += (idx + 1) + "   ";
    }
    store += "\n";

    for (let row = 0; row < size; row++) {
        store += ` ${String.fromCharCode(row + 65)} |`;
        for (let col = 0; col < size; col++) {
            store += ` ${board[tic.rowColToIndex(board, row, col)]} |`;
        }
        store += '\n   ' + '+---'.repeat(size) + '+\n';
    }

    console.log(store);  
}


function startGame(board, playerLetter, computerLetter, computerMoves) {
    while (!(tic.getWinner(board) || tic.isBoardFull(board))) {
        const playerMove = userMove(board);
        board = tic.placeLetter(board, playerLetter, playerMove);
        printBoard(board);

        if (tic.getWinner(board) || tic.isBoardFull(board)) {
            break;
        }

        question("Press <ENTER> to show computer's move... \n");
        const compMove = computerMove(board, computerMoves);
        console.log(`Computer moves: ${compMove}`);
        board = tic.placeLetter(board, computerLetter, compMove);
        printBoard(board);

        if (tic.getWinner(board) || tic.isBoardFull(board)) {
            break;
        }
    }

    const winner = tic.getWinner(board);
    if (winner === "X") {
        console.log("Player won!");
    } else if (winner === "O") {
        console.log("Computer won!");
    } else {
        console.log("It's a draw!");
    }
}

function main() {
    let board;
    let playerLetter = 'X';
    let computerLetter = 'O';
    let computerMoves = [];

    const configFile = process.argv[2];

    if (configFile) {
        fs.readFile(configFile, 'utf8', (err, data) => {
            if (err) {
                console.log("Configuration file not found");
                process.exit(1);
            }
            const info = JSON.parse(data);
            board = tic.boardFromString(info.board);
            playerLetter = info.playerLetter;
            computerLetter = info.computerLetter;
            computerMoves = info.computerMoves;

            startGame(board, playerLetter, computerLetter, computerMoves);
        });
    } else {
        board = tic.generateBoard(3, 3, ' ');
        startGame(board, playerLetter, computerLetter, computerMoves);
    }
}

main();
// cd desktop/homework01-Youngsang-Cho1-1
// node app.js