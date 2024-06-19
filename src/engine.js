function boardToString(board) {
  return board.join("");
}

function boardFromString(string) {
  return string.split("").map((x) => parseInt(x));
}

class Node {
  constructor(board, player, parent) {
    this.state = new State(board, player);
    this.board = board;
    this.player = player; // 현재 board 에서 마지막으로 둔 player
    this.parent = parent;
    this.children = [];
    this.visits = 0;
    this.wins = 0;
    this.draws = 0;
    this.loses = 0;
    this.possibleMoves = this.determine();
  }

  selection() {
    if (this.isTerminal()) {
      this.possibleMoves.length = 0;
      this.simulate();
      return this;
    }
    if (!this.isFull()) return this;
    let selectedNode = null;
    let maxUct = -Infinity;
    for (const child of this.children) {
      let uct = this.calculateUCT(child);
      if (uct > maxUct) {
        maxUct = uct;
        selectedNode = child;
      }
    }
    // console.log(selectedNode)
    if (selectedNode.isFull()) return selectedNode.selection();
    if (selectedNode.isTerminal()) selectedNode.simulate();
    return selectedNode;
  }

  calculateUCT(node) {
    const wins = node.wins;
    const draws = node.draws;
    const visits = node.visits;
    const parentVisits = this.visits;
    const C = Math.sqrt(2);
    if (visits === 0) {
      return Infinity;
    }
    return (
      (wins + 0.5 * draws) / visits +
      C * Math.sqrt(Math.log(parentVisits) / visits)
    );
  }

  expansion() {
    if (this.possibleMoves.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * this.possibleMoves.length);
    // const newBoard = this.possibleMoves.splice(randomIndex, 1)[0];
    const newBoard = boardFromString(this.possibleMoves.splice(randomIndex, 1)[0]);
    const newNode = new Node(newBoard, 3 - this.player, this);
    this.children.push(newNode);
    return newNode;
  }

  /**
   * 가능한 행동을 결정하는 함수
   */
  determine() {
    if (!this.board.includes(0)) return [];
    let b = [];
    // for (let i = 0; i < this.board.length; i++) {
    //   let newBoard = this.board.slice();
    //   if (newBoard[i] === 0) {
    //     newBoard[i] = 3 - this.player;
    //     b.push(newBoard);
    //   }
    // }
    // for (let i = 0; i < this.board.length; i++) {
    //   let newBoard = boardToString(this.board);
    //   if (newBoard[i] == "0") {
    //     newBoard = newBoard.substring(0, i) + (3 - this.player).toString() + newBoard.substring(i + 1);
    //     b.push(newBoard);
    //   }
    // }
    for (let i of this.nearIndex()) {
      let newBoard = boardToString(this.board);
      newBoard = newBoard.substring(0, i) + (3 - this.player).toString() + newBoard.substring(i + 1);
      b.push(newBoard);
    }
    return b;
  }

  nearIndex() {
    let near = [];
    const size = Math.sqrt(this.board.length);
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i] !== 0) {
        for (let j of [-2*size, -size, 0, size, 2*size]) {
          for (let k of [-2, -1, 0, 1, 2]) {
            let idx = i + j + k;
            if (idx >= 0 && idx < this.board.length && this.board[idx] === 0) {
              near.push(idx);
            }
          }
        }
      }
    }
    return [...new Set(near)];
  }

  isTerminal() {
    return isWin(this.board) !== 0 || this.board.includes(0) === false;
  }

  isFull() {
    return this.possibleMoves.length === 0;
  }

  winRate() {
    return this.visits > 0 ? (this.wins + 0.5 * this.draws) / this.visits : 0;
  }

  simulate() {
    for (let i = 0; i < 2; i++) {
      const result = this.state.simulate();
      switch (result[0]) {
        case this.player:
          this.addWins(1);
          // this.addWins(10-result[1]);
          break;
        case 3 - this.player:
          this.addLoses(1);
          // this.addLoses(10-result[1]);
          break;
        case 0:
          this.addDraws(1);
          break;
      }
    }
  }

  addWins(weight = 1) {
    this.wins += weight;
    this.visits += weight;
    if (this.parent !== null) this.parent.addLoses(weight);
  }

  addDraws(weight = 1) {
    this.draws += weight;
    this.visits += weight;
    if (this.parent !== null) this.parent.addDraws(weight);
  }

  addLoses(weight = 1) {
    this.loses += weight;
    this.visits += weight;
    if (this.parent !== null) this.parent.addWins(weight);
  }
}

export class RootNode extends Node {
  constructor(board = [0, 0, 0, 0, 0, 0, 0, 0, 0], player = 1, parent = null) {
    super(board, player, parent);
  }
}

import { ticWin, omokWin } from "./win.js";

export function isWin(board) {
  if (board.length===225) return isOmokWin(board);
  for (const [a, b, c] of ticWin) {
    if (board[a] === board[b] && board[b] === board[c] && board[a] !== 0) {
      return board[a];
    }
  }
  return 0;
}


export function isOmokWin(board) {
  for (const [a, b, c, d, e] of omokWin) {
    if (
      board[a] === board[b] &&
      board[b] === board[c] &&
      board[c] === board[d] &&
      board[d] === board[e] &&
      board[a] !== 0
    ) {
      return board[a];
    }
  }
  return 0;
}

class State {
  constructor(board, player) {
    this.board = board;
    this.player = player; // 현재 board 에서 마지막으로 둔 player
    this.round = 0;
  }

  simulate() {
    const newBoard = this.board.slice();
    if (isWin(newBoard)) {
      return [isWin(newBoard), this.round];
    }
    const randomMove = () => {
      let r = Math.floor(Math.random() * this.board.length);
      while (newBoard[r] != 0) {
        r = Math.floor(Math.random() * this.board.length);
      }
      return r;
    };
    this.round = 0;
    while (newBoard.includes(0)) {
      this.round += 1;
      newBoard[randomMove()] = 3 - this.player;
      if (isWin(newBoard)) {
        return [isWin(newBoard), this.round];
      }
      this.player = this.player === 1 ? 2 : 1;
    }
    return [0, Math.floor(this.round / 2)];
  }
}

export default class MCTS {
  constructor(
    n_iterations = 1000,
    board = [0, 0, 0, 0, 0, 0, 0, 0, 0],
    player = 1,
  ) {
    this.n_iterations = n_iterations;
    this.board = board;
    this.player = player;
    this.root = new Node(board, player, null);
  }

  search() {
    for (let i = 0; i < this.n_iterations; i++) {
      if (i%100===0) console.log(Math.round(i/this.n_iterations*100*10)/10 + "%");
      let node = this.root;

      node = node.selection();
      // console.log("selection", node);
      if (node === null) return this.nextBoard();
      if (node.isTerminal()) {
        // console.log("터미널");
        continue;
      }

      node = node.expansion();
      // console.log("expansion", node);
      if (node === null) {
        // console.log("확장 중지");
        continue;
      }

      node.simulate();
    }
    return this.nextBoard();
  }

  nextBoard() {
    return this.root.children.reduce(
      (a, b) => (a.winRate() > b.winRate() ? a : b),
      this.root.children[0]
    ).board;
  }
}

// const board = new Array(225).fill(0);
// board[113] = 1;
// const mcts = new MCTS(10000, board);
// console.log(mcts.search());