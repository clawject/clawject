import ts, { factory } from 'typescript';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { isLifecycleMethodBean } from '../ts/predicates/isLifecycleMethodBean';
import { isDecoratorFromLibrary } from '../decorator-processor/isDecoratorFromLibrary';
import { getDecorators } from '../ts/utils/getDecorators';
import { ComponentRepository } from '../component/ComponentRepository';
import { Component } from '../component/Component';
import { processLifecycleElement } from './processLifecycleElement';
import { isLifecycleArrowFunctionBean } from '../ts/predicates/isLifecycleArrowFunctionBean';
import { getImplicitComponentStaticInitBlock } from './transformers/getImplicitComponentStaticInitBlock';
import { IncorrectNameError } from '../../compilation-context/messages/errors/IncorrectNameError';
import { isNameReserved } from '../utils/isNameReserved';
import { Value } from '../../../runtime/Value';

export function processImplicitComponents(
  node: ts.ClassDeclaration,
  compilationContext: CompilationContext,
  shouldAddImports: Value<boolean>
): ts.Node {
  let component: Component | null = null;

  const newMembers = node.members.map(it => {
    const elementDecorators = getDecorators(it);
    const hasDecoratorsFromLibrary = elementDecorators
      .some(it => isDecoratorFromLibrary(it, undefined));

    if (!hasDecoratorsFromLibrary) {
      return it;
    } else {
      //If there are decorators from library, then we should add imports
      shouldAddImports.value = true;
    }


    component = component ?? ComponentRepository.register(node, false);

    if (isNameReserved(it.name?.getText() ?? '')) {
      compilationContext.report(new IncorrectNameError(
        `'${it.name?.getText() ?? ''}' name is reserved for the di-container.`,
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

  if (component === null || compilationContext.languageServiceMode) {
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

