import { alg, Graph } from 'graphlib';
import { Bean } from '../bean/Bean';
import { Configuration } from '../configuration/Configuration';
import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { mapFilter } from '../utils/mapFilter';

export class DependencyGraph {
  static graph = new Graph();

  static addNodeWithEdges(node: Bean, edges: Bean[]) {
    edges.forEach(edge => this.graph.setEdge(node.id, edge.id));
  }

  static getCycle(): Map<Configuration, Bean[][]> {
    const cycledBeanIds = alg.findCycles(this.graph);

    if (cycledBeanIds.length === 0) {
      return new Map();
    }

    const flatCycledBeanIds = new Set(cycledBeanIds.flat());
    const filteredGraph = this.graph.filterNodes(id => flatCycledBeanIds.has(id));
    const filteredGraphEdges = filteredGraph.edges();

    const cycles = new Map<string, string[]>();

    filteredGraphEdges.forEach(edge => {
      let currentNode = edge.v;
      const cycle = cycles.get(edge.v) ?? [edge.v];
      cycles.set(edge.v, cycle);

      while (true) {
        const nextEdge = filteredGraphEdges.find((e) => e.v === currentNode);
        if (nextEdge) {
          cycle.push(nextEdge.w);
          currentNode = nextEdge.w;
          if (currentNode === edge.v) {
            break;
          }
        } else {
          break;
        }
      }
    });

    const relatedConfigurations = this.getRelatedConfigurations(cycledBeanIds);
    const resultMap = new Map<Configuration, Bean[][]>();

    cycles.forEach(idsList => {
      //Assuming that all beans are placed in the same context
      const relatedConfiguration = relatedConfigurations.get(idsList[0]);

      if (!relatedConfiguration) {
        return;
      }

      const beans = mapFilter(
        idsList,
        it => relatedConfiguration.beanRegister.getById(it) ?? null,
        (it): it is Bean => it !== null,
      );

      const addedBeans = resultMap.get(relatedConfiguration) ?? [];
      resultMap.set(relatedConfiguration, addedBeans);

      addedBeans.push(beans);
    });

    return resultMap;
  }

  static clearByConfiguration(configuration: Configuration): void {
    configuration.beanRegister.elements.forEach(bean => {
      this.graph.removeNode(bean.id);
    });
  }

  static clear(): void {
    this.graph = new Graph();
  }

  //returns beanId to Configuration
  private static getRelatedConfigurations(beanIds: string[][] | string[]): Map<string, Configuration> {
    return new Map(mapFilter(
      beanIds.flat(),
      it => [it, ConfigurationRepository.getConfigurationByBeanId(it)],
      (it): it is [string, Configuration] => it[1] !== null,
    ));
  }
}
