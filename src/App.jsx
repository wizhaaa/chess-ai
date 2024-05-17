import {useState, useMemo, useCallback} from "react";
import "./App.css";
import {Chessboard} from "react-chessboard";

import {Chess, DEFAULT_POSITION} from "chess.js";

import {makeBotMove} from "./AI";

function App() {
  // game logic
  var chess = useMemo(() => new Chess(DEFAULT_POSITION), []);

  const [position, setPosition] = useState(DEFAULT_POSITION);

  

  function resetBoard() {
    try {
      setPosition(DEFAULT_POSITION);
      chess = new Chess(DEFAULT_POSITION);
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
      return true;
    } catch (e) {
      // alert("error");
      console.log(e);
      return false;
    }
  }

  function makeAMove(move) {
    try {
      chess.move(move);
      // const gameCopy = game;
      // const result = gameCopy.move(move);
      // setGame(gameCopy);
      // return result;
    } catch (e) {
      console.log(e);
      alert("invalid drop move");
      return null;
    }
  }

  function move() {
    try {
      chess.move({from: "a2", to: "a3"});

      setPosition(chess.fen());
    } catch (e) {
      console.log(e);
      alert("Invalid Move");
    }
    console.log("Moves available after moves:");
    console.log(chess.moves());
  }

  function botMove() {
    try {
      console.log("Bot Move Options:");
      console.log(chess.moves());
      const newGame = makeBotMove(chess);

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
      <div className="container">
        <div>Current Turn: {chess.turn() === "w" ? "White" : "Black"} </div>
        <div>
          {" "}
          Last Move: {chess.history({verbose: true})[2]?.from} -{" "}
          {chess.history({verbose: true})[2]?.to}
        </div>
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
