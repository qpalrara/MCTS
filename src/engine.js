function boardToString(board) {
  return board.join("");
}

function boardFromString(string) {
  return string.split("").map((x) => parseInt(x));
}

function nearIndex(board) {
  let near = [];
  const size = Math.sqrt(board.length);
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== 0) {
      for (let j of [-2 * size, -size, 0, size, 2 * size]) {
        for (let k of [-2, -1, 0, 1, 2]) {
          let idx = i + j + k;
          if (idx >= 0 && idx < board.length && board[idx] === 0) {
            near.push(idx);
          }
        }
      }
    }
  }
  return [...new Set(near)];
}

export class Node {
  constructor(board, player, parent) {
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
      this.simulation();
      return this;
    }
    if (!this._isFull()) return this;
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
    if (selectedNode._isFull()) return selectedNode.selection();
    if (selectedNode.isTerminal()) selectedNode.simulation();
    return selectedNode;
  }

  calculateUCT(node) {
    const C = Math.sqrt(2);
    if (node.visits === 0) {
      return Infinity;
    }
    return (
      (node.wins + 0.5 * node.draws) / node.visits +
      C * Math.sqrt(Math.log(this.visits) / node.visits)
    );
  }

  expansion() {
    if (this.possibleMoves.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * this.possibleMoves.length);
    // const newBoard = this.possibleMoves.splice(randomIndex, 1)[0];
    const newBoard = boardFromString(
      this.possibleMoves.splice(randomIndex, 1)[0]
    );
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

    if (Node.expansionNear) {
      for (let i of nearIndex(this.board)) {
        let newBoard = boardToString(this.board);
        newBoard =
          newBoard.substring(0, i) +
          (3 - this.player).toString() +
          newBoard.substring(i + 1);
        b.push(newBoard);
      }
      return b;
    }

    for (let i = 0; i < this.board.length; i++) {
      let newBoard = boardToString(this.board);
      if (newBoard[i] == "0") {
        newBoard =
          newBoard.substring(0, i) +
          (3 - this.player).toString() +
          newBoard.substring(i + 1);
        b.push(newBoard);
      }
    }

    return b;
  }

  simulation() {
    const playout = () => {
      const newBoard = this.board.slice();
      let player = this.player;
      const res = isWin(newBoard);
      if (res) {
        return res;
      }

      while (newBoard.includes(0)) {
        newBoard[this._getRandomMove(newBoard)] = 3 - player;
        const result = isWin(newBoard);
        if (result) {
          return result;
        }
        player = 3 - player;
      }
      return 0;
    };
    for (let i = 0; i < Node.simulation_count; i++) {
      const result = playout();
      if (result === this.player) {
        this._addWins(1);
      } else if (result === 3 - this.player) {
        this._addLoses(1);
      } else {
        this._addDraws(1);
      }
    }
  }

  isTerminal() {
    return isWin(this.board) !== 0 || this.board.includes(0) === false;
  }

  _isFull() {
    return this.possibleMoves.length === 0;
  }

  winRate() {
    return this.visits > 0 ? (this.wins + 0.5 * this.draws) / this.visits : 0;
  }

  _getRandomMove(board) {
    if (Node.simulationNear) {
      const near = nearIndex(board);
      return near[Math.floor(Math.random() * near.length)];
    }
    const empty_spots = board
      .map((c, i) => (c === 0 ? i : -1))
      .filter((c) => c !== -1);
    const randomIndex = Math.floor(Math.random() * empty_spots.length);
    return empty_spots[randomIndex];
  }

  _addWins(weight = 1) {
    this.wins += weight;
    this.visits += weight;
    if (this.parent !== null) this.parent._addLoses(weight);
  }

  _addDraws(weight = 1) {
    this.draws += weight;
    this.visits += weight;
    if (this.parent !== null) this.parent._addDraws(weight);
  }

  _addLoses(weight = 1) {
    this.loses += weight;
    this.visits += weight;
    if (this.parent !== null) this.parent._addWins(weight);
  }
}

import { ticWin, omokWin } from "./win.js";

export function isWin(board) {
  if (board.length === 225) return isOmokWin(board);
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
