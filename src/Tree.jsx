function getTree(node, nodes, edges, startX, startY) {
  if (node.children.length === 0) return 0;
  for (let i = 0; i < node.children.length; i++) {
    nodes.push({
      x: startX + 500 * ((i + 0.5) / node.children.length) - 250,
      y: startY + 100,
      // winRate: node.children[i].winRate(),
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

export default function Tree({ rootNode }) {
  const nodes = [];
  const edges = [];

  if (rootNode !== null) {
    // nodes.push({ x: 1000, y: 50, winRate: rootNode.winRate() });
    nodes.push({ x: 1000, y: 50 });
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
          // fill={`rgb(255, ${255 - node.winRate * 255}, ${
          //   255 - node.winRate * 255
          // }`}
          fill="rgb(255, 0, 0)"
          stroke="black"
        />
      ))}
    </svg>
  );
}