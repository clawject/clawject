import graphlib from 'graphlib';
import { Bean } from '../bean/Bean';
import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { mapAndFilter } from '../utils/mapAndFilter';
import { analyzeGraph } from 'graph-cycles';

const { Graph, alg } = graphlib;

export class DependencyGraph {
  graph = new Graph();

  addNodeWithEdges(node: Bean, edges: Bean[]) {
    edges.forEach(edge => this.graph.setEdge(node.id, edge.id));
  }

  getCycle(): Bean[][] {
    if (alg.isAcyclic(this.graph)) {
      return [];
    }

    const { cycles } = analyzeGraph(
      this.graph.nodes().map(node => {
        const nodeEdges = (this.graph.outEdges(node) ?? []).map(it => it.w);

        return [node, nodeEdges];
      })
    );

    return cycles.map(beanIds => {
      return mapAndFilter(
        beanIds,
        beanId => {
          const relatedConfiguration = ConfigurationRepository.getConfigurationByBeanId(beanId);
          return relatedConfiguration?.beanRegister.getById(beanId);
        },
        (it): it is Bean => Boolean(it),
      );
    });
  }

  clear(): void {
    this.graph = new Graph();
  }
}
