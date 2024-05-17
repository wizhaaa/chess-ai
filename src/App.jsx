import {useState, useMemo, useEffect} from "react";
import {Chessboard} from "react-chessboard";
import {Chess, DEFAULT_POSITION} from "chess.js";

import {makeBestMove} from "./wz_ai";
import "./App.css";

function App() {
  /* Game logic, state, and positions stored in chess */
  var chess = useMemo(() => new Chess(DEFAULT_POSITION), []);

  const [position, setPosition] = useState(DEFAULT_POSITION); // position state to store what our board GUI should render. default to the a new game.
  const [turnNum, setTurnNum] = useState(0);
  const [play, setPlay] = useState(false);

  /*
   * Listens to user keyboard events
   */
  useEffect(() => {
    if (chess.turn() === "b" && play) {
      console.log("Bot automatically making move...");
      makeBestMove(chess);
      setPosition(chess.fen());
      setTurnNum(turnNum + 1);
    }

    const handleKeyPress = (event) => {
      if (event.key === "a") botMove();
      if (event.key === "u") undo();
      if (event.key === "r") resetBoard();
      if (event.key === "s") runSimulation();
      if (event.key === "p") setPlay(() => !play);
    };

    // Add event listener when component mounts
    document.addEventListener("keydown", handleKeyPress);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [position, play]); // Empty dependency array ensures that the effect runs only once on mount

  /** Resets the board to the default position. */
  function resetBoard() {
    try {
      chess.clear();
      chess.load(DEFAULT_POSITION);
      setPosition(chess.fen());
    } catch (e) {
      console.log(e);
    }
  }

  /** Allows for player movement to control the board. */
  function handleDrop(from, to) {
    console.log("drop");
    try {
      console.log(from, to);
      chess.move({from: from, to: to, promotion: "q"});
      setPosition(chess.fen());
      setTurnNum(turnNum + 1);

      return true;
    } catch (e) {
      // alert("error");
      console.log(e);
      return false;
    }
  }

  /** Bot makes the next best move given a game state. */
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

  /** Runs a simulation for 10 moves of the bot against itself. */
  async function runSimulation() {
    for (let i = 0; i < 10; i++) {
      try {
        // if (i % 2 === 0) ericBotMove(chess);
        // else
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
      <button onClick={() => setPlay(!play)}> Play [P] </button>
      <div className="container">
        <div>
          Current Turn: {chess.turn() === "w" ? "White" : "Black"} [{turnNum}]{" "}
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
