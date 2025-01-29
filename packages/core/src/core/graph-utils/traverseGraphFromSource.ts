import { Graph } from 'graphlib';

export const traverseGraphFromSource = <T>(
  graph: Graph,
  source: string,
  valueSelector: (node: string) => T | null | undefined,
  callback: (node: T) => void
): void => {
  const visited = new Set<string>();
  const stack = [source];

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (visited.has(node)) {
      continue;
    }

    const value = valueSelector(node);
    //TODO: Throw error if value is null or undefined
    if (value) {
      callback(value);
    }

    visited.add(node);
    const neighbors = graph.successors(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }
};
