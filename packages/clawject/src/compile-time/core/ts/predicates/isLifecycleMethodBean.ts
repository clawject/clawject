import ts from 'typescript';
import { extractDecoratorMetadata } from '../../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../../decorator-processor/DecoratorKind';

export const isLifecycleMethodBean = (node: ts.Node): node is ts.MethodDeclaration =>
    ts.isMethodDeclaration(node) && (
        extractDecoratorMetadata(node, DecoratorKind.PostConstruct) !== null || extractDecoratorMetadata(node, DecoratorKind.BeforeDestruct) !== null
    );
