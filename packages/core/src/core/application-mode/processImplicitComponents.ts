import type * as ts from 'typescript';
import { isLifecycleMethodBean } from '../ts/predicates/isLifecycleMethodBean';
import { getDecorators } from '../ts/utils/getDecorators';
import { ComponentRepository } from '../component/ComponentRepository';
import { Component } from '../component/Component';
import { processLifecycleElement } from './transformers/processLifecycleElement';
import { isLifecycleArrowFunctionBean } from '../ts/predicates/isLifecycleArrowFunctionBean';
import { getImplicitComponentStaticInitBlock } from './transformers/getImplicitComponentStaticInitBlock';
import { Context } from '../../compilation-context/Context';
import { Value } from '../utils/Value';
import { DecoratorProcessor } from '../decorators/DecoratorProcessor';

export function processImplicitComponents(
  node: ts.ClassDeclaration,
  shouldAddImports: Value<boolean>
): ts.Node {
  let component: Component | null = null;

  const hasDecoratorsFromLibrary = node.members.some(it => getDecorators(it).some(it => DecoratorProcessor.isRegisteredDecorator(it)));

  if (!hasDecoratorsFromLibrary) {
    return node;
  }

  shouldAddImports.value = true;

  const newMembers = node.members.map(it => {
    component = component ?? ComponentRepository.register(node, false);

    //Processing lifecycle methods
    if (isLifecycleMethodBean(it) || isLifecycleArrowFunctionBean(it)) {
      return processLifecycleElement(it, component);
    }

    return it;
  });

  if (component === null || Context.languageServiceMode) {
    return node;
  }

  return Context.factory.updateClassDeclaration(
    node,
    node.modifiers,
    node.name,
    node.typeParameters,
    node.heritageClauses,
    [
      ...newMembers,
      getImplicitComponentStaticInitBlock(component),
    ]
  );
}

