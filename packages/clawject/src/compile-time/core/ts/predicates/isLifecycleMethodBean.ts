import type * as ts from 'typescript';
import { extractDecoratorMetadata } from '../../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../../decorator-processor/DecoratorKind';
import { Context } from '../../../compilation-context/Context';

export const isLifecycleMethodBean = (node: ts.Node): node is ts.MethodDeclaration =>
  Context.ts.isMethodDeclaration(node) && (
    extractDecoratorMetadata(node, DecoratorKind.PostConstruct) !== null || extractDecoratorMetadata(node, DecoratorKind.PreDestroy) !== null
  );
