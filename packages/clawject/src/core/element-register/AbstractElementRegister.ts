import ts from 'typescript';

export abstract class AbstractElementRegister<T extends { id: string, node: N }, N = ts.Node> {
    counter = 0;
    elements = new Set<T>();

    idToElement = new Map<string, T>();
    nodeToElement = new Map<N, T>();

    abstract register(element: T): void;

    deregister(element: T): void {
        this.elements.delete(element);
        this.idToElement.delete(element.id);
        this.nodeToElement.delete(element.node);
    }

    getByNode(node: N): T | null {
        return this.nodeToElement.get(node) ?? null;
    }

    getById(id: string): T | null {
        return this.idToElement.get(id) ?? null;
    }
}
