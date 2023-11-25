import graphlib from 'graphlib';
import { Bean } from '../bean/Bean';
import { Configuration } from '../configuration/Configuration';
import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { mapFilter } from '../utils/mapFilter';
import { analyzeGraph } from 'graph-cycles';

const { Graph, alg } = graphlib;

export class DependencyGraph {
  static graph = new Graph();

  static addNodeWithEdges(node: Bean, edges: Bean[]) {
    edges.forEach(edge => this.graph.setEdge(node.id, edge.id));
  }

  static getCycle(): Map<Configuration, Bean[][]> {
    if (alg.isAcyclic(this.graph)) {
      return new Map();
    }

    const { cycles } = analyzeGraph(
      this.graph.nodes().map(node => {
        const nodeEdges = (this.graph.outEdges(node) ?? []).map(it => it.w);

        return [node, nodeEdges];
      })
    );

    const allBeanIds = new Set(cycles.flat());
    const relatedConfigurations = this.getRelatedConfigurations(allBeanIds);

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
  private static getRelatedConfigurations(beanIds: Set<string>): Map<string, Configuration> {
    return new Map(mapFilter(
      Array.from(beanIds),
      it => [it, ConfigurationRepository.getConfigurationByBeanId(it)],
      (it): it is [string, Configuration] => it[1] !== null,
    ));
  }
}
