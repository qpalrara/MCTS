import { useState, useEffect } from "react";
import "./App.css";
import { Toggle, BoardSetting } from "./UI";
import Header from "./Header";
import Tree from "./Tree";
import Tile from "./Tile";

function App() {
  const [showTree, setShowTree] = useState(false);
  const [rootNode, setRootNode] = useState(null);
  const [autoplayOn, setAutoplayOn] = useState(false);
  const [size, setSize] = useState(15);
  const [emptyBoard, setEmptyBoard] = useState(Array(size * size).fill(0));
  const [board, setBoard] = useState(emptyBoard);
  const [tiles, setTiles] = useState([]);
  const [process, setProcess] = useState(0);
  const [simulationCount, setSimulationCount] = useState(10);

  const [n, setN] = useState(5000);
  const [loading, setLoading] = useState(true);
  const [near, setNear] = useState(false);
  const [nearSimul, setNearSimul] = useState(false);

  function loadTiles() {
    let newTiles = [];
    for (let i = 0; i < size * size; i++) {
      newTiles.push(
        <Tile
          key={i}
          index={i}
          board={board}
          setBoard={setBoard}
          play={play}
          autoplayOn={autoplayOn}
          size={size}
        />
      );
    }
    setTiles(newTiles);
  }

  useEffect(() => {
    loadTiles();
  }, [board]);

  useEffect(() => {
    const newEmptyBoard = Array(size * size).fill(0);
    setEmptyBoard(newEmptyBoard);
    setBoard(newEmptyBoard);
    loadTiles();
  }, [size]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === "c") {
        event.preventDefault();
        navigator.clipboard
          .writeText(board.join(""))
          .then(() => {
            console.log("Text copied to clipboard");
          })
          .catch((err) => {
            console.error("Failed to copy text: ", err);
          });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [board]);

  // let mcts = null;
  // function play(board) {
  //   if (mcts !== null) {
  //     mcts = null;
  //   }
  //   mcts = new MCTS(50000, board, 1);
  //   const newBoard = mcts.search();
  //   setRootNode(mcts.root);
  //   setBoard(newBoard);
  // }

  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const newWorker = new Worker(new URL("./mctsWorker.js", import.meta.url), {
      type: "module",
    });

    newWorker.onmessage = function (event) {
      const { process, completed, newBoard, root } = event.data;
      setProcess(process);
      if (completed) {
        setRootNode(root);
        setBoard(newBoard);
        newWorker.terminate();
        setWorker(null);
      }
    };

    setWorker(newWorker);

    return () => {
      if (newWorker) {
        newWorker.terminate();
      }
    };
  }, [board]);

  const play = (board) => {
    if (worker) {
      worker.postMessage({
        board: board,
        n_iteration: n,
        player: 1,
        simulationCount: simulationCount,
        expansionNear: near,
        simulationNear: nearSimul,
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        size={size}
        setSize={setSize}
        board={board}
        n={n}
        setN={setN}
        simulationCount={simulationCount}
        setSimulationCount={setSimulationCount}
        loading={loading}
        setLoading={setLoading}
        near={near}
        setNear={setNear}
        nearSimul={nearSimul}
        setNearSimul={setNearSimul}
      />
      <div className="flex justify-end items-center h-full w-full">
        <div
          className="grid aspect-square"
          style={{
            width: "var(--tile-container-width)",
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            border:
              size === 3
                ? "var(--border-width) solid black"
                : "calc(var(--border-width)/2) solid black",
          }}
          id={size === 3 ? "" : "tile-container-animation"}
        >
          {tiles}
        </div>
        <div className="grid grid-cols-1 xl:pr-40 lg:pr-16 md:pr-12 sm:pr-8">
          <div className="flex justify-center items-center h-12">
            <p className="font-semibold text-font">자동실행&nbsp;&nbsp;</p>{" "}
            <Toggle on={autoplayOn} setOn={setAutoplayOn} />
          </div>
          <button
            onClick={() => play(board)}
            className="bg-red-400 hover:bg-red-500 text-white w-36 h-20 text-4xl font-semibold px-4 py-2 mx-20 my-2 rounded-lg"
          >
            실행
          </button>
          <button
            onClick={() => {
              worker.terminate();
              setBoard(emptyBoard);
            }}
            className="bg-blue-400 hover:bg-blue-500 text-white w-36 h-20 text-4xl font-semibold px-4 py-2 mx-20 my-2 rounded-lg"
          >
            초기화
          </button>
          <button
            onClick={() => setShowTree(!showTree)}
            className="bg-emerald-400 hover:bg-emerald-500 text-white w-36 h-20 text-4xl font-semibold px-4 py-2 mx-20 my-2 rounded-lg"
          >
            트리
          </button>
          <BoardSetting setBoard={setBoard} />
          <p className="w-36 h-20 text-4xl text-center text-font font-semibold px-4 py-2 mx-20 my-2" style={{display:loading?"block":"none"}}>
            {process}%
          </p>
        </div>
      </div>
      <div className={`${!showTree && "hidden"}`}>
        <Tree rootNode={rootNode} />
      </div>
    </div>
  );
}

export default App;
