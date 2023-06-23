import { alg, Graph } from 'graphlib';
import { Bean } from '../bean/Bean';
import { Configuration } from '../configuration/Configuration';
import { ConfigurationRepository } from '../configuration/ConfigurationRepository';

export class DependencyGraph {
    private static graph = new Graph({directed: true});

    static addNodeWithEdges(node: Bean, edges: Bean[]) {
        this.graph.setNodes(
            [
                node.id,
                ...edges.map(it => it.id),
            ]
        );

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

            const beans = this.mapFilter(
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
        this.graph = new Graph({directed: true});
    }

    //returns beanId to Configuration
    private static getRelatedConfigurations(beanIds: string[][] | string[]): Map<string, Configuration> {
        return new Map(this.mapFilter(
            beanIds.flat(),
            it => [it, ConfigurationRepository.getConfigurationByBeanId(it)],
            (it): it is [string, Configuration] => it[1] !== null,
        ));
    }

    private static mapFilter<T, U, S extends U>(
        array: T[],
        mapfn: (value: T, index: number, array: T[]) => U,
        filterFn: (value: U, index: number, array: U[]) => value is S
    ): S[] {
        const resultList: S[] = [];

        for (let i = 0; i < array.length; i++) {
            const mapped = mapfn(array[i], i, array);

            filterFn(mapped, i, resultList) && resultList.push(mapped);
        }

        return resultList;
    }
}
