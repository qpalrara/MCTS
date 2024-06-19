import { useState, useEffect } from "react";
import "./App.css";
import MCTS, { isWin, isOmokWin } from "./engine";
import { Toggle, Menu } from "./UI";
import { load } from "three/examples/jsm/libs/opentype.module.js";

function Tile({ index, board, setBoard, play, autoplayOn, size = 3 }) {
  const value = board[index];
  return (
    <div
      onClick={() => {
        const newBoard = [...board];
        newBoard[index] = 1;
        setBoard(newBoard);
        if (autoplayOn) play(newBoard);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        const newBoard = [...board];
        newBoard[index] = 2;
        setBoard(newBoard);
      }}
      className={`w-full aspect-square
      border-black border-2 hover:bg-gray-200
      text-center flex justify-center items-center font-semibold 
      ${
        size === 3
          ? "xl:text-8xl lg:text-8xl md:text-7xl sm:text-6xl text-5xl"
          : "xl:text-3xl lg:text-2xl md:text:lg sm:text-md text-sm"
      }
      ${value === 1 ? "text-blue-500" : value === 2 ? "text-red-500" : ""}`}
    >
      {value === 1 ? "O" : value === 2 ? "X" : ""}
    </div>
  );
}

function getTree(node, nodes, edges, startX, startY) {
  if (node.children.length === 0) return 0;
  for (let i = 0; i < node.children.length; i++) {
    nodes.push({
      x: startX + 500 * ((i + 0.5) / node.children.length) - 250,
      y: startY + 100,
      winRate: node.children[i].winRate(),
    });
    edges.push({
      x1: startX,
      y1: startY,
      x2: startX + 500 * ((i + 0.5) / node.children.length) - 250,
      y2: startY + 100,
    });
    getTree(
      node.children[i],
      nodes,
      edges,
      startX + 500 * ((i + 0.5) / node.children.length) - 250,
      startY + 100
    );
  }
}

function Tree({ rootNode }) {
  const nodes = [];
  const edges = [];

  if (rootNode !== null) {
    nodes.push({ x: 1000, y: 50, winRate: rootNode.winRate() });
    getTree(rootNode, nodes, edges, 1000, 50);
  }

  const width = 2000;
  const height = 2000;

  return (
    <svg width={width} height={height}>
      {edges.map((edge, idx) => (
        <line
          key={idx}
          x1={edge.x1}
          y1={edge.y1}
          x2={edge.x2}
          y2={edge.y2}
          stroke="black"
        />
      ))}
      {nodes.map((node, idx) => (
        <circle
          key={idx}
          cx={node.x}
          cy={node.y}
          r={20} // 원의 반지름
          fill={`rgb(255, ${255 - node.winRate * 255}, ${
            255 - node.winRate * 255
          }`}
          stroke="black"
        />
      ))}
    </svg>
  );
}

function App() {
  const [showTree, setShowTree] = useState(false);
  const [rootNode, setRootNode] = useState(null);
  const [autoplayOn, setAutoplayOn] = useState(false);
  const [size, setSize] = useState(3);
  const [emptyBoard, setEmptyBoard] = useState(Array(size * size).fill(0));
  const [board, setBoard] = useState(emptyBoard);
  const [tiles, setTiles] = useState([]);

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

  function resize() {
    if (size === 3) {
      setSize(15);
    } else {
      setSize(3);
    }
  }

  let mcts = null;
  function play(board) {
    if (mcts !== null) {
      mcts = null;
    }
    mcts = new MCTS(200000, board, 1);
    const newBoard = mcts.search();
    setRootNode(mcts.root);
    setBoard(newBoard);
  }


  return (
    <>
      <Menu />
      <div
        className={`text-6xl font-semibold absolute w-full text-center top-10 ${
          isWin(board, true) === 2 ? "text-red-400" : "text-blue-400"
        }`}
      >
        {!!isWin(board, true) && "플레이어 " + isWin(board, true) + " 승리"}
      </div>
      <div
        className="absolute top-10 right-10 super-button font-bold text-xl text-blue-400"
        onClick={resize}
      >
        <span className="text-red-400">
          {size === 3 ? "오목으로" : "틱택토로"}
        </span>{" "}
        변경
      </div>
      <div className="flex justify-end items-center h-full w-full">
        <div
          className={`flex-auto grid ${
            size === 3
              ? "grid-cols-3 xl:px-72 lg:px-28 md:px-16 sm:px-12 px-4"
              : "grid-cols-15 xl:px-40 lg:px-20 md:px-10 sm:px-6 px-4"
          }`}
        >
          {tiles}
        </div>
        <div className="grid grid-cols-1 xl:pr-40 lg:pr-16 md:pr-12 sm:pr-8">
          <div className="flex justify-center items-center h-12">
            <p className="font-semibold">자동실행&nbsp;</p>{" "}
            <Toggle on={autoplayOn} setOn={setAutoplayOn} />
          </div>
          <button
            onClick={() => play(board)}
            className="bg-red-400 hover:bg-red-500 text-white w-36 h-20 text-4xl font-semibold px-4 py-2 mx-20 my-2 rounded-lg"
          >
            실행
          </button>
          <button
            onClick={() => setBoard(emptyBoard)}
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
        </div>
      </div>
      <div className={`${!showTree && "hidden"}`}>
        <Tree rootNode={rootNode} />
      </div>
    </>
  );
}

export default App;
