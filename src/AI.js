// import {Chess} from "chess.js";

// Evaluation function to evaluate the current state of the board
function evaluateBoard(board) {
  // Simple evaluation function: count the material advantage of white over black
  const pieceValues = {
    p: -1,
    n: -5,
    b: -5,
    r: -8,
    q: -50,
    k: -100,
    P: 1,
    N: 5,
    B: 5,
    R: 8,
    Q: 50,
    K: 100,
  };

  let evaluation = 0;
  board.split(" ").forEach((row) => {
    row
      .split("/")
      .join("")
      .split("")
      .forEach((piece) => {
        evaluation += pieceValues[piece] || 0;
      });
  });
  return evaluation;
}

// Minimax function with alpha-beta pruning
function minimax(board, depth, maximizingPlayer, alpha, beta) {
  if (depth === 0 || board.isGameOver()) {
    return evaluateBoard(board.fen());
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    const moves = board.moves();

    for (let i = 0; i < moves.length; i++) {
      board.move(moves[i]);
      const evaluation = minimax(board, depth - 1, false, alpha, beta);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      board.undo();

      if (beta <= alpha) {
        break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    const moves = board.moves();

    for (let i = 0; i < moves.length; i++) {
      board.move(moves[i]);
      const evaluation = minimax(board, depth - 1, true, alpha, beta);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      board.undo();

      if (beta <= alpha) {
        break;
      }
    }
    return minEval;
  }
}

// Function to find the best move using minimax
function findBestMove(board, depth) {
  let bestMove = null;
  let bestEval = -Infinity;
  const moves = board.moves();

  for (let i = 0; i < moves.length; i++) {
    board.move(moves[i]);
    const evaluation = minimax(board, depth - 1, false, -Infinity, Infinity);
    board.undo();

    if (evaluation > bestEval) {
      bestEval = evaluation;
      bestMove = moves[i];
    }
  }
  return bestMove;
}

// Create a new instance of the Chess game
// const game = new Chess();

// Function to make the bot's move using minimax
/** makeBotMove
 * @param game (Chess object)
 * @returns the fen for the game
 */
export function makeBotMove(game) {
  const bestMove = findBestMove(game, 3); // Adjust depth for stronger/weaker play
  game.move(bestMove);
  console.log("Bot's Move:", bestMove);
  return game;
}

// Example: Make the bot play against itself until the game ends
// while (!game.game_over()) {
//   makeBotMove();
// }

// Print the final result of the game
// console.log("Game Over. Result:", game.result());
