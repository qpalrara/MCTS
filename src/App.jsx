import { useState, Fragment } from "react";
import "./App.css";
import MCTS, { isWin, isOmokWin } from "./engine";
import { Toggle } from "./UI";

function Tile({ index, board, setBoard, play, autoplayOn }) {
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
      className={`w-12 h-12 border-black border-2 text-center flex justify-center items-center text-4xl font-semibold ${
        value === 1 ? "text-blue-500" : value === 2 ? "text-red-500" : ""
      }`}
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
  const height = 4000;

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

const size = 15;
const ticBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
const omokBoard = Array(size*size).fill(0);
function App() {
  const [board, setBoard] = useState(omokBoard);
  const [showTree, setShowTree] = useState(false);
  const [rootNode, setRootNode] = useState(null);
  const [autoplayOn, setAutoplayOn] = useState(true)
  function play(board) {
    const mcts = new MCTS(10000, 5, board, 1);
    const newBoard = mcts.search();
    setRootNode(mcts.root);
    setBoard(newBoard);
  }
  const tiles = [];
  for (let i = 0; i < size*size; i++) {
    tiles.push(<Tile key={i} index={i} board={board} setBoard={setBoard} play={play} autoplayOn={autoplayOn}/>);
  }

  return (
    <>
      <div
        className={`text-6xl font-semibold absolute px-60 ${
          isWin(board, true) === 2 ? "text-red-400" : "text-blue-400"
        }`}
      >
        {!!isWin(board, true,) && "플레이어 " + isWin(board, true) + " 승리"}
      </div>
      <div className="flex justify-center items-center h-screen">
        <div className={`grid grid-cols-15`}>{tiles}</div>
        <div className="grid grid-cols-1">
          <button
            onClick={()=>play(board)}
            className="bg-red-400 text-white w-36 h-20 text-4xl font-semibold px-4 py-2 mx-20 my-2 rounded-lg"
          >
            실행
          </button>
          <div className="flex justify-center items-center h-12">
            <p className="font-semibold">자동실행&nbsp;</p> <Toggle on={autoplayOn} setOn={setAutoplayOn}/>
          </div>
          <button
            onClick={() => setBoard(omokBoard)}
            className="bg-blue-400 text-white w-36 h-20 text-4xl font-semibold px-4 py-2 mx-20 my-2 rounded-lg"
          >
            재시작
          </button>
          <button
            onClick={() => setShowTree(!showTree)}
            className="bg-emerald-400 text-white w-36 h-20 text-4xl font-semibold px-4 py-2 mx-20 my-2 rounded-lg"
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
