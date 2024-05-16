import {useState} from "react";
import "./App.css";
import Chessboard from "chessboardjsx";

import {Chess, DEFAULT_POSITION} from "chess.js";

import {makeBotMove} from "./AI";

function App() {
  // game logic
  const chess = new Chess(DEFAULT_POSITION);
  // console.log(validateFen(chess.fen()));

  const [position, setPosition] = useState(DEFAULT_POSITION);

  function resetBoard() {
    setPosition(DEFAULT_POSITION);
  }

  function move() {
    try {
      // chess.move({from: "b2", to: "b4"});
      chess.move("e4");
      // chess.move("Nf6");
      setPosition(chess.fen());
    } catch {
      alert("Invalid Move");
    }
  }

  function botMove() {
    try {
      const newPosition = makeBotMove(chess);
      setPosition(newPosition);
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
        width={700}
        position={position}
        transitionDuration={100}
        boardStyle={{
          borderRadius: "10px",
        }}
        lightSquareStyle={{
          background: "#ececcc",
        }}
        darkSquareStyle={{
          background: "#698c4c",
        }}
        dropSquareStyle={{
          boxShadow: "inset 0 0 1px 4px #000",
        }}
      />
    </div>
  );
}

export default App;
