import { Graph } from 'graphlib';

export const findAllPaths = getAllPathsDFS;

//TODO choose between DFS and BFS, DFS slower for small graphs, BFS slower for large graphs
/**
 * Finds all paths from source to target using Depth-First Search (DFS)
 */
function dfsFindAllPaths(
  graph: Graph,
  source: string,
  target: string,
  visited: Set<string>,
  path: string[],
  allPaths: string[][]
) {
  visited.add(source);
  path.push(source);

  if (source === target) {
    allPaths.push([...path]); // Store a copy of the current path
  } else {
    const neighbors = graph.successors(source) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfsFindAllPaths(graph, neighbor, target, visited, path, allPaths);
      }
    }
  }

  // Backtrack
  path.pop();
  visited.delete(source);
}

/**
 * Get all paths from a source to all other nodes using DFS
 */
function getAllPathsDFS(graph: Graph, source: string): Record<string, string[][]> {
  const allPaths: Record<string, string[][]> = {};
  const visited = new Set<string>();

  graph.nodes().forEach((node) => {
    if (node !== source) {
      const paths: string[][] = [];
      dfsFindAllPaths(graph, source, node, visited, [], paths);
      allPaths[node] = paths;
    }
  });

  return allPaths;
}

/**
 * Finds all paths from source to target using Breadth-First Search (BFS)
 */
function getAllPathsBFS(graph: Graph, source: string): Record<string, string[][]> {
  const allPaths: Record<string, string[][]> = {};

  graph.nodes().forEach((target) => {
    if (target !== source) {
      const paths: string[][] = [];
      const queue: string[][] = [[source]];

      while (queue.length > 0) {
        const currentPath = queue.shift()!;
        const lastNode = currentPath[currentPath.length - 1];

        if (lastNode === target) {
          paths.push(currentPath);
        } else {
          const neighbors = graph.successors(lastNode) || [];
          for (const neighbor of neighbors) {
            if (!currentPath.includes(neighbor)) {
              queue.push([...currentPath, neighbor]);
            }
          }
        }
      }

      allPaths[target] = paths;
    }
  });

  return allPaths;
}
