import{ Graph, alg } from 'graphlib'
import { findAllPaths } from "./graphUtils";

const graph = new Graph();

graph.setEdge('Application', 'B1');
graph.setEdge('Application', 'C1');
graph.setEdge('Application', 'D1');
graph.setEdge('B1', 'B2');
graph.setEdge('B2', 'B3');
graph.setEdge('B3', 'T');
graph.setEdge('C1', 'C2');
graph.setEdge('C2', 'C3');
graph.setEdge('C3', 'T');
graph.setEdge('D1', 'D2');
graph.setEdge('D2', 'D3');
graph.setEdge('D3', 'T');

const t0 = performance.now();
const shortest = alg.dijkstra(graph, 'Application', edge => {
  switch (edge.v) {
    case 'B1':
    case 'B2':
    case 'B3':
    case 'C1':
    case 'C2':
    case 'D1':
      return 1;

    default:
      return 0;
  }
});
const t1 = performance.now();

console.log(shortest, t1 - t0);
