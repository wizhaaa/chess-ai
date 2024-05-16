import {useState, useMemo, useCallback} from "react";
import "./App.css";
import {Chessboard} from "react-chessboard";

import {Chess, DEFAULT_POSITION} from "chess.js";

import {makeBotMove} from "./AI";

function App() {
  // game logic
  const chess = useMemo(() => new Chess(DEFAULT_POSITION), []);
  const [game, setGame] = useState(new Chess(DEFAULT_POSITION));
  // console.log(validateFen(chess.fen()));

  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [gameOver, setGameOver] = useState("");

  function resetBoard() {
    setPosition(DEFAULT_POSITION);
  }

  function handleDrop(from, to) {
    const moveData = {
      from: from,
      to: to,
      color: chess.turn(),
      promotion: "q",
    };
    const move = makeAMove(moveData);
    if (move === null) {
      alert("Can not drop");
      return false;
    }
    return true;
  }

  function makeAMove(move) {
    const gameCopy = {...game};
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result;
  }

  function move() {
    try {
      // chess.move({from: "b2", to: "b4"});
      chess.move("Na3");
      // chess.move("Nf6");
      setPosition(chess.fen());
    } catch {
      alert("Invalid Move");
    }
    console.log("Moves available after moves:");
    console.log(chess.moves());
  }

  function botMove() {
    try {
      console.log("Bot Move Options:");
      console.log(game.moves());
      const newGame = makeBotMove(game);
      // setGame(newGame);

      setPosition(newGame.fen());
    } catch (e) {
      alert("Error in making bot move");
      console.log(e);
    }
  }

  return (
    <div>
      <div className="title"> CHESS AI</div>
      <button onClick={resetBoard}> Reset </button>
      <button onClick={move}> Move </button>
      <button onClick={botMove}> AI MOVE </button>
      <Chessboard
        onDrop={handleDrop}
        boardWidth={700}
        position={game.fen()}
        // transitionDuration={100}
        customeLightSquareStyle={{
          background: "#ececcc",
        }}
        customDarkSquareStyle={{
          background: "#698c4c",
        }}
        // dropSquareStyle={{
        //   boxShadow: "inset 0 0 1px 4px #000",
        // }}
      />
    </div>
  );
}

export default App;
