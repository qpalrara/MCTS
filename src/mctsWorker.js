import { Node } from './engine';

class MCTS {
  constructor(
    n_iterations = 1000,
    board = [0, 0, 0, 0, 0, 0, 0, 0, 0],
    player = 1,
    simulation_count = 10,
    expansionNear = false,
    simulationNear = false,
  ) {
    this.n_iterations = n_iterations;
    this.board = board;
    this.player = player;
    Node.simulation_count = simulation_count;
    Node.expansionNear = expansionNear;
    Node.simulationNear = simulationNear;
    this.root = new Node(board, player, null);
  }

  search() {
    for (let i = 0; i < this.n_iterations; i++) {
      self.postMessage({ process: ((i / this.n_iterations) * 100).toFixed(1), completed: false });

      let node = this.root;

      node = node.selection();
      if (node === null) return this.nextBoard();
      if (node.isTerminal()) {
        continue;
      }

      node = node.expansion();
      if (node === null) {
        continue;
      }

      node.simulation();
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

self.onmessage = (event) => {
  const { board, n_iteration, player, simulationCount, expansionNear, simulationNear } = event.data;
  console.log(expansionNear, simulationNear)

  let mcts = new MCTS(n_iteration, board, player, simulationCount, expansionNear, simulationNear );
  const newBoard = mcts.search();

  // TODO: tree 구현을 위한 svg를 메인 스레드로 전달
  // Warning: root node를 메인 스레드로 전달하면 안됨. 가비지 컬렉터가 동작하지 않음
  // self.postMessage({ process: 100, completed: true, newBoard, root: mcts.root });
  self.postMessage({ process: 100, completed: true, newBoard, root: new Node(new Array(9).fill(0), 1, null) });
  mcts = null;
};