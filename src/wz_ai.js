import {Chess, DEFAULT_POSITION} from "chess.js";
const pawnEvalWhite = [
  [100, 100, 100, 100, 105, 100, 100, 100],
  [78, 83, 86, 73, 102, 82, 85, 90],
  [7, 29, 21, 44, 40, 31, 44, 7],
  [-17, 16, -2, 15, 14, 0, 15, -13],
  [-26, 3, 10, 9, 6, 1, 0, -23],
  [-22, 9, 5, -11, -10, -2, 3, -19],
  [-31, 8, -7, -37, -36, -14, 3, -31],
  [0, 0, 0, 0, 0, 0, 0, 0],
];
const knightEvalWhite = [
  [-66, -53, -75, -75, -10, -55, -58, -70],
  [-3, -6, 100, -36, 4, 62, -4, -14],
  [10, 67, 1, 74, 73, 27, 62, -2],
  [24, 24, 45, 37, 33, 41, 25, 17],
  [-1, 5, 31, 21, 22, 35, 2, 0],
  [-18, 10, 13, 22, 18, 15, 11, -14],
  [-23, -15, 2, 0, 2, 0, -23, -20],
  [-74, -23, -26, -24, -19, -35, -22, -69],
];
const bishopEvalWhite = [
  [-59, -78, -82, -76, -23, -107, -37, -50],
  [-11, 20, 35, -42, -39, 31, 2, -22],
  [-9, 39, -32, 41, 52, -10, 28, -14],
  [25, 17, 20, 34, 26, 25, 15, 10],
  [13, 10, 17, 23, 17, 16, 0, 7],
  [14, 25, 24, 15, 8, 25, 20, 15],
  [19, 20, 11, 6, 7, 6, 20, 16],
  [-7, 2, -15, -12, -14, -15, -10, -10],
];
const rookEvalWhite = [
  [35, 29, 33, 4, 37, 33, 56, 50],
  [55, 29, 56, 67, 55, 62, 34, 60],
  [19, 35, 28, 33, 45, 27, 25, 15],
  [0, 5, 16, 13, 18, -4, -9, -6],
  [-28, -35, -16, -21, -13, -29, -46, -30],
  [-42, -28, -42, -25, -25, -35, -26, -46],
  [-53, -38, -31, -26, -29, -43, -44, -53],
  [-30, -24, -18, 5, -2, -18, -31, -32],
];
const queenEvalWhite = [
  [6, 1, -8, -104, 69, 24, 88, 26],
  [14, 32, 60, -10, 20, 76, 57, 24],
  [-2, 43, 32, 60, 72, 63, 43, 2],
  [1, -16, 22, 17, 25, 20, -13, -6],
  [-14, -15, -2, -5, -1, -10, -20, -22],
  [-30, -6, -13, -11, -16, -11, -16, -27],
  [-36, -18, 0, -19, -15, -15, -21, -38],
  [-39, -30, -31, -13, -31, -36, -34, -42],
];
const kingEvalWhite = [
  [4, 54, 47, -99, -99, 60, 83, -62],
  [-32, 10, 55, 56, 56, 55, 10, 3],
  [-62, 12, -57, 44, -67, 28, 37, -31],
  [-55, 50, 11, -4, -19, 13, 0, -49],
  [-55, -43, -52, -28, -51, -47, -8, -50],
  [-47, -42, -43, -79, -64, -32, -29, -32],
  [-4, 3, -14, -50, -57, -18, 13, 4],
  [17, 30, -3, -14, 6, -1, 40, 18],
];
const pawnEvalBlack = pawnEvalWhite.slice().reverse();
const knightEvalBlack = knightEvalWhite.slice().reverse();
const bishopEvalBlack = bishopEvalWhite.slice().reverse();
const rookEvalBlack = rookEvalWhite.slice().reverse();
const queenEvalBlack = queenEvalWhite.slice().reverse();
const kingEvalBlack = kingEvalWhite.slice().reverse();

function evaluateBoard(game) {
  let totalEvaluation = 0;
  const board = game.board();
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      totalEvaluation += getPieceValue(board[row][col], row, col);
    }
  }

  return totalEvaluation;
}

function getPieceValue(piece, x, y) {
  if (piece === null) {
    return 0;
  }

  let getAbsoluteValue = function (piece, isWhite, x, y) {
    if (piece.type === "p") {
      return 100 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);
    } else if (piece.type === "r") {
      return 479 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
    } else if (piece.type === "n") {
      return 280 + (isWhite ? knightEvalWhite[y][x] : knightEvalBlack[y][x]);
    } else if (piece.type === "b") {
      return 320 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
    } else if (piece.type === "q") {
      return 929 + (isWhite ? queenEvalWhite[y][x] : queenEvalBlack[y][x]);
    } else if (piece.type === "k") {
      return 60000 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
    }
  };

  let absoluteValue = getAbsoluteValue(piece, piece.color === "w", x, y);

  return piece.color === "w" ? absoluteValue : -absoluteValue;
}

function minimaxRoot(depth, game, isMaximisingPlayer) {
  var newGameMoves = game.moves({verbose: true});
  newGameMoves.sort(() => Math.random() - 0.5);
  var bestMove = -9999;
  var bestMoveFound;
  for (var i = 0; i < newGameMoves.length; i++) {
    var newGameMove = newGameMoves[i];
    game.move(newGameMove);
    var value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
    game.undo();
    if (value >= bestMove) {
      bestMove = value;
      bestMoveFound = newGameMove;
    }
  }
  return bestMoveFound;
}

function minimax(depth, game, alpha, beta, isMaximisingPlayer) {
  // positionCount++;
  if (depth === 0) {
    return -evaluateBoard(game);
  }
  var newGameMoves = game.moves({verbose: true});
  newGameMoves.sort(() => Math.random() - 0.5);

  if (isMaximisingPlayer) {
    let bestMove = -9999;
    for (var i = 0; i < newGameMoves.length; i++) {
      game.move(newGameMoves[i]);
      bestMove = Math.max(
        bestMove,
        minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer)
      );
      game.undo();
      alpha = Math.max(alpha, bestMove);
      if (beta <= alpha) {
        return bestMove;
      }
    }
    return bestMove;
  } else {
    let bestMove = 9999;
    for (let i = 0; i < newGameMoves.length; i++) {
      game.move(newGameMoves[i]);
      bestMove = Math.min(
        bestMove,
        minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer)
      );
      game.undo();
      beta = Math.min(beta, bestMove);
      if (beta <= alpha) {
        return bestMove;
      }
    }
    return bestMove;
  }
}

function negamax(chess, depth, alpha, beta, colorSign) {
  var bestMove = null;
  const weight = Math.random() * (2 - 0.5) + 0.5;

  if (depth === 0) {
    return {eval: colorSign * weight * evaluateBoard(chess), move: bestMove};
  }
  var moves = chess.moves({verbose: true});
  for (var i = 0; i < moves.length; i++) {
    chess.move(moves[i]);
    var result = negamax(chess, depth - 1, -beta, -alpha, -colorSign);
    chess.undo();
    var score = -result.eval;
    if (score >= beta) {
      return {eval: beta, move: bestMove}; // fail-hard beta-cutoff
    }
    if (score > alpha) {
      alpha = score; // alpha acts like max in MiniMax
      bestMove = moves[i];
    }
  }
  return {eval: alpha, move: bestMove};
}

export function makeBestMove(game) {
  var bestMove = getBestMove(game);
  game.move(bestMove);
  return game;
}

function getBestMove(game) {
  if (game.isGameOver()) {
    console.log("Game Over");
  }
  // let positionCount = 0;
  var depth = calculateDepth(game);
  // var bestMove = minimaxRoot(depth, game, game.turn() === "w");
  let bestMove = negamax(
    game,
    depth,
    -Infinity,
    Infinity,
    game.turn() === "w" ? 1 : -1
  ).move;
  return bestMove;
}

function calculateDepth(game) {
  // var totalPieces = game.fen().split(\\" \\", 1)[0].replace(/[\\\\d\\/]/g, '').length
  // if (totalPieces > 14) { return 2; } else { return 4; }
  return 3;
}

const game = new Chess(DEFAULT_POSITION);

console.log(makeBestMove(game));
