import {useState, useMemo, useEffect} from "react";
import "./App.css";
import {Chessboard} from "react-chessboard";

import {Chess, DEFAULT_POSITION} from "chess.js";

import {makeBestMove} from "./wz_ai";

function App() {
  // game logic
  var chess = useMemo(() => new Chess(DEFAULT_POSITION), []);

  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [turnNum, setTurnNum] = useState(0);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "a") botMove();
      if (event.key === "u") undo();
      if (event.key === "r") resetBoard();
      if (event.key === "s") runSimulation();
    };

    // Add event listener when component mounts
    document.addEventListener("keydown", handleKeyPress);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []); // Empty dependency array ensures that the effect runs only once on mount

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
      // const newGame = makeBotMove(chess);
      const chess2 = makeBestMove(chess);

      setPosition(chess2.fen());
    } catch (e) {
      // alert("Error in making bot move");
      console.log(e);
    }
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function runSimulation() {
    for (let i = 0; i < 10; i++) {
      try {
        makeBestMove(chess);
        console.log(`Simulation step ${i}`);
        setPosition(chess.fen());
        await wait(300); // Wait for 1000 milliseconds (1 second)
      } catch (e) {
        console.log(`loop ${i} error: ${e}`);
      }
    }
  }

  function undo() {
    chess.undo();
    setPosition(chess.fen());
  }

  return (
    <div>
      <div className="title"> CHESS AI</div>
      <button onClick={resetBoard}> Reset [R] </button>
      <button onClick={undo}> Undo [U] </button>

      <button onClick={runSimulation}> Simulate (10 steps) [S] </button>
      <button onClick={botMove}> AI Move [A] </button>
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
