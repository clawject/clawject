import { alg, Graph } from 'graphlib';
import { Bean } from '../bean/Bean';
import { Configuration } from '../configuration/Configuration';
import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { mapFilter } from '../utils/mapFilter';

export class DependencyGraph {
  private static graph = new Graph();

  static addNodeWithEdges(node: Bean, edges: Bean[]) {
    edges.forEach(edge => this.graph.setEdge(node.id, edge.id));
  }

  static getCycle(): Map<Configuration, Bean[][]> {
    const cycledBeanIds = alg.findCycles(this.graph);
    const relatedConfigurations = this.getRelatedConfigurations(cycledBeanIds);
    const resultMap = new Map<Configuration, Bean[][]>();

    cycledBeanIds.forEach(idsList => {
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
