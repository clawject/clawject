import ts, { factory } from 'typescript';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { isLifecycleMethodBean } from '../ts/predicates/isLifecycleMethodBean';
import { isDecoratorFromLibrary } from '../decorator-processor/isDecoratorFromLibrary';
import { getDecoratorsOnly } from '../ts/utils/getDecoratorsOnly';
import { ComponentRepository } from '../component/ComponentRepository';
import { Component } from '../component/Component';
import { processLifecycleElement } from './processLifecycleElement';
import { isLifecycleArrowFunctionBean } from '../ts/predicates/isLifecycleArrowFunctionBean';
import { getImplicitComponentStaticInitBlock } from './transformers/getImplicitComponentStaticInitBlock';
import { IncorrectNameError } from '../../compilation-context/messages/errors/IncorrectNameError';
import { isNameReserved } from '../utils/isNameReserved';

export function processImplicitComponents(
  node: ts.ClassDeclaration,
  compilationContext: CompilationContext,
): ts.Node {
  let component: Component | null = null;

  const newMembers = node.members.map(it => {
    const elementDecorators = getDecoratorsOnly(it);
    const hasDecoratorsFromLibrary = elementDecorators
      .some(it => isDecoratorFromLibrary(it, undefined));

    if (!hasDecoratorsFromLibrary) {
      return it;
    }

    component = component ?? ComponentRepository.register(node, false);

    if (isNameReserved(it.name?.getText() ?? '')) {
      compilationContext.report(new IncorrectNameError(
        `"${it.name?.getText() ?? ''}" name is reserved for the di-container.`,
        it,
        null,
      ));

      return it;
    }

    //Processing lifecycle methods
    if (isLifecycleMethodBean(it) || isLifecycleArrowFunctionBean(it)) {
      return processLifecycleElement(it, component);
    }

    return it;
  });

  if (component === null) {
    return node;
  }

  return factory.updateClassDeclaration(
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

