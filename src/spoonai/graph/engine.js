/**
 * Graph Engine - Workflow orchestration with nodes and edges
 */

export class GraphEngine {
  constructor() {
    this.graphs = new Map();
  }

  async initialize() {
    // Initialize graph execution engine
  }

  createGraph(name) {
    const graph = new Graph(name);
    this.graphs.set(name, graph);
    return graph;
  }

  getGraph(name) {
    return this.graphs.get(name);
  }

  async execute(graphName, input, config = {}) {
    const graph = this.graphs.get(graphName);
    if (!graph) {
      throw new Error(`Graph ${graphName} not found`);
    }

    return await graph.execute(input, config);
  }

  async shutdown() {
    this.graphs.clear();
  }
}

class Graph {
  constructor(name) {
    this.name = name;
    this.nodes = new Map();
    this.edges = [];
    this.startNode = null;
    this.endNode = null;
  }

  addNode(id, nodeFunc, config = {}) {
    this.nodes.set(id, {
      id,
      execute: nodeFunc,
      config
    });
    return this;
  }

  addEdge(from, to, condition = null) {
    this.edges.push({ from, to, condition });
    return this;
  }

  setStart(nodeId) {
    this.startNode = nodeId;
    return this;
  }

  setEnd(nodeId) {
    this.endNode = nodeId;
    return this;
  }

  async execute(input, config = {}) {
    if (!this.startNode) {
      throw new Error('No start node defined');
    }

    let currentNode = this.startNode;
    let state = { input, ...config };
    const executionPath = [];

    while (currentNode && currentNode !== this.endNode) {
      const node = this.nodes.get(currentNode);
      if (!node) {
        throw new Error(`Node ${currentNode} not found`);
      }

      executionPath.push(currentNode);

      // Execute node
      state = await node.execute(state);

      // Find next node
      const nextEdge = this.edges.find(edge => {
        if (edge.from !== currentNode) return false;
        if (!edge.condition) return true;
        return edge.condition(state);
      });

      currentNode = nextEdge ? nextEdge.to : this.endNode;
    }

    return {
      result: state,
      executionPath
    };
  }

  toJSON() {
    return {
      name: this.name,
      nodes: Array.from(this.nodes.keys()),
      edges: this.edges,
      startNode: this.startNode,
      endNode: this.endNode
    };
  }
}

// Pre-built graph patterns
export class GraphPatterns {
  static createSequentialGraph(name, steps) {
    const graph = new Graph(name);
    
    steps.forEach((step, index) => {
      graph.addNode(`step_${index}`, step);
      if (index > 0) {
        graph.addEdge(`step_${index - 1}`, `step_${index}`);
      }
    });

    graph.setStart('step_0');
    graph.setEnd(`step_${steps.length - 1}`);

    return graph;
  }

  static createConditionalGraph(name, config) {
    const graph = new Graph(name);
    
    // Add decision node
    graph.addNode('decision', config.decisionFunc);
    
    // Add branch nodes
    graph.addNode('branch_a', config.branchA);
    graph.addNode('branch_b', config.branchB);
    
    // Add merge node
    graph.addNode('merge', config.mergeFunc);

    // Add edges with conditions
    graph.addEdge('decision', 'branch_a', state => state.condition === 'a');
    graph.addEdge('decision', 'branch_b', state => state.condition === 'b');
    graph.addEdge('branch_a', 'merge');
    graph.addEdge('branch_b', 'merge');

    graph.setStart('decision');
    graph.setEnd('merge');

    return graph;
  }

  static createLoopGraph(name, config) {
    const graph = new Graph(name);
    
    graph.addNode('check', config.checkFunc);
    graph.addNode('process', config.processFunc);
    graph.addNode('complete', config.completeFunc);

    graph.addEdge('check', 'process', state => !state.done);
    graph.addEdge('process', 'check');
    graph.addEdge('check', 'complete', state => state.done);

    graph.setStart('check');
    graph.setEnd('complete');

    return graph;
  }
}
