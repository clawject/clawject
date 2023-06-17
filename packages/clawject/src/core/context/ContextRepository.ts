import ts from 'typescript';
import { Context } from './Context';
import { unquoteString } from '../utils/unquoteString';
import { DependencyGraph } from '../dependencies/DependencyGraph';

export class ContextRepository {
    static fileNameToLastContextCounter = new Map<string, number>();
    static fileNameToContexts = new Map<string, Context[]>();
    static contextIdToContext = new Map<string, Context>();

    static register(classDeclaration: ts.ClassDeclaration): Context {
        const sourceFile = classDeclaration.getSourceFile();

        const context = new Context();

        context.id = this.buildId(classDeclaration);
        context.fileName = classDeclaration.getSourceFile().fileName;
        context.node = classDeclaration;

        if (classDeclaration.name !== undefined) {
            context.name = unquoteString(classDeclaration.name.getText());
        }

        const descriptors = this.fileNameToContexts.get(sourceFile.fileName) ?? [];
        this.fileNameToContexts.set(sourceFile.fileName, descriptors);
        descriptors.push(context);

        this.contextIdToContext.set(context.id, context);

        return context;
    }

    static getContextByBeanId(beanId: string): Context | null {
        const contextId = beanId.match(/(.*)_\d+$/);

        if (contextId === null) {
            //TODO warn for debug mode
            return null;
        }

        return this.contextIdToContext.get(contextId[1]) ?? null;
    }

    private static buildId(classDeclaration: ts.ClassDeclaration): string {
        const sourceFile = classDeclaration.getSourceFile();
        const lastContextCounter = this.fileNameToLastContextCounter.get(sourceFile.fileName);
        const newCounter = (lastContextCounter ?? 0) + 1;
        this.fileNameToLastContextCounter.set(sourceFile.fileName, newCounter);

        return `${sourceFile.fileName}_${newCounter}`;
    }

    static clear(): void {
        this.fileNameToContexts.clear();
        this.fileNameToLastContextCounter.clear();
        this.contextIdToContext.clear();
    }

    static clearByFileName(fileName: string): void {
        const contexts = this.fileNameToContexts.get(fileName) ?? [];

        this.fileNameToContexts.delete(fileName);
        this.fileNameToLastContextCounter.delete(fileName);
        contexts.forEach(context => {
            this.contextIdToContext.delete(context.id);

            DependencyGraph.clearByContext(context);
        });
    }
}
