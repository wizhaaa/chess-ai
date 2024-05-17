var Chess = require("./chess").Chess;

var chess = new Chess();

function negamax(chess, depth, alpha, beta, colorSign) {
  var bestMove = null;
  if (depth === 0) {
    return {eval: colorSign * evaluateBoard(chess.board()), move: bestMove};
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
// example of how you can evaluate the board
function evaluateBoard(board) {
  var totalEvaluation = 0;
  for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 8; col++) {
      totalEvaluation = totalEvaluation + getPieceValue(board[row][col]);
    }
  }
  return totalEvaluation;
}

function makeBestMove(game) {
  var bestMove = getBestMove(game);
  game.ugly_move(bestMove);
  return game;
}

function getBestMove(game) {
  var bestMove = negamax(
    game,
    3,
    -Infinity,
    Infinity,
    game.turn() === "w" ? 1 : -1
  ).move;
  return bestMove;
}
