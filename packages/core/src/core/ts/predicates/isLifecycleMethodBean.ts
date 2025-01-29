import type ts from 'typescript';
import { Context } from '../../../compilation-context/Context';
import { DecoratorProcessor } from '../../decorators/DecoratorProcessor';
import { BaseDecorators } from '../../decorators/BaseDecorators';

export const isLifecycleMethodBean = (node: ts.Node): node is ts.MethodDeclaration =>
  Context.ts.isMethodDeclaration(node) && (
    DecoratorProcessor.extractFirstDecoratorEntity(node, BaseDecorators.PostConstruct) !== null ||
    DecoratorProcessor.extractFirstDecoratorEntity(node, BaseDecorators.PreDestroy) !== null
  );
