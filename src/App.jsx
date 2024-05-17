import {useState, useMemo} from "react";
import "./App.css";
import {Chessboard} from "react-chessboard";

import {Chess, DEFAULT_POSITION} from "chess.js";

import {makeBotMove} from "./AI";

function App() {
  // game logic
  var chess = useMemo(() => new Chess(DEFAULT_POSITION), []);

  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [turnNum, setTurnNum] = useState(0);

  function resetBoard() {
    try {
      chess.clear();
      chess.load(DEFAULT_POSITION);
      setPosition(chess.fen());
    } catch (e) {
      console.log(e);
    }
  }

  function handleDrop(from, to) {
    console.log("drop");
    try {
      console.log(from, to);
      chess.move({from, to});
      setPosition(chess.fen());
      setTurnNum(turnNum + 1);

      return true;
    } catch (e) {
      // alert("error");
      console.log(e);
      return false;
    }
  }

  function botMove() {
    try {
      console.log("Bot Move Options:");
      console.log(chess.moves());
      const newGame = makeBotMove(chess);
      setTurnNum(turnNum + 1);

      setPosition(newGame.fen());
      console.log("history: ", chess.history({verbose: true}));
    } catch (e) {
      alert("Error in making bot move");
      console.log(e);
    }
  }

  function simulation() {
    for (let i = 0; i < 10; i++) {
      try {
        makeBotMove(chess);
        console.log(`Simulation step ${i}`);
      } catch (e) {
        console.log(`loop ${i} error: ${e}`);
      }
    }
    setPosition(chess.fen());
  }

  return (
    <div>
      <div className="title"> CHESS AI</div>
      <button onClick={resetBoard}> Reset </button>
      <button onClick={simulation}> Simulate (10 steps) </button>
      <button onClick={botMove}> AI MOVE </button>
      <div className="container">
        <div>Current Turn: {chess.turn() === "w" ? "White" : "Black"} </div>
      </div>
      <Chessboard
        onPieceDrop={handleDrop}
        boardWidth={700}
        position={position}
        customeLightSquareStyle={{
          background: "#ececcc",
        }}
        customDarkSquareStyle={{
          background: "#698c4c",
        }}
      />
    </div>
  );
}

export default App;
