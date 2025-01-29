import { Graph, alg } from 'graphlib';

export const getPredecessors = <T>(graph: Graph, node: string, selector: (node: string) => T): T[] => {
  const predecessors = graph.predecessors(node) ?? [];

  return predecessors.map(selector);
};
