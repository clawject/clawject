import { alg, Graph } from 'graphlib';
import { ContextBean } from '../bean/ContextBean';
import { Context } from '../context/Context';
import { ContextRepository } from '../context/ContextRepository';

export class DependencyGraph {
    private static graph = new Graph({directed: true});

    static addNodeWithEdges(node: ContextBean, edges: ContextBean[]) {
        this.graph.setNodes(
            [
                node.id,
                ...edges.map(it => it.id),
            ]
        );

        edges.forEach(edge => this.graph.setEdge(node.id, edge.id));
    }

    static getCycle(): Map<Context, ContextBean[][]> {
        const cycledBeanIds = alg.findCycles(this.graph);
        const relatedContexts = this.getRelatedContexts(cycledBeanIds);
        const resultMap = new Map<Context, ContextBean[][]>();

        cycledBeanIds.forEach(idsList => {
            //Assuming that all beans are placed in the same context
            const relatedContext = relatedContexts.get(idsList[0]);

            if (!relatedContext) {
                //TODO warn for debug mode
                return;
            }

            const beans = this.mapFilter(
                idsList,
                it => relatedContext.getBeanById(it) ?? null,
                (it): it is ContextBean => it !== null,
            );

            const addedBeans = resultMap.get(relatedContext) ?? [];
            resultMap.set(relatedContext, addedBeans);

            addedBeans.push(beans);
        });

        return resultMap;
    }

    static clearByContext(context: Context): void {
        context.beans.forEach(bean => {
            this.graph.removeNode(bean.id);
        });
    }

    static clear(): void {
        this.graph = new Graph({directed: true});
    }

    //returns beanId to Context
    private static getRelatedContexts(beanIds: string[][] | string[]): Map<string, Context> {
        return new Map(this.mapFilter(
            beanIds.flat(),
            it => [it, ContextRepository.getContextByBeanId(it)],
            (it): it is [string, Context] => it[1] !== null,
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
