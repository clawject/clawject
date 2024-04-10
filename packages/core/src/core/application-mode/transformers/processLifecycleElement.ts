import type * as ts from 'typescript';
import { Component } from '../../component/Component';
import { isStaticallyKnownPropertyName } from '../../ts/predicates/isStaticallyKnownPropertyName';
import { IncorrectNameError } from '../../../compilation-context/messages/errors/IncorrectNameError';
import { getNameFromNodeOrNull } from '../../ts/utils/getNameFromNodeOrNull';
import { ComponentLifecycle } from '../../component-lifecycle/ComponentLifecycle';
import { ClassPropertyWithArrowFunctionInitializer } from '../../ts/types';
import { NotSupportedError } from '../../../compilation-context/messages/errors/NotSupportedError';
import { NotStaticallyKnownError } from '../../../compilation-context/messages/errors/NotStaticallyKnownError';
import { Context } from '../../../compilation-context/Context';
import { LifecycleKind } from '../../../runtime-metadata/LifecycleKind';
import { DecoratorProcessor } from '../../decorators/DecoratorProcessor';
import { filterLibraryModifiers } from '../../ts/utils/filterLibraryModifiers';
import { BaseDecorators } from '../../decorators/BaseDecorators';

export function processLifecycleElement(node: ts.MethodDeclaration | ClassPropertyWithArrowFunctionInitializer, component: Component): ts.ClassElement {
  const lifecycles = new Set<LifecycleKind>();

  const postConstructDecoratorMetadata = DecoratorProcessor.extractFirstDecoratorEntity(node, BaseDecorators.PostConstruct);
  const preDestroyDecoratorMetadata = DecoratorProcessor.extractFirstDecoratorEntity(node, BaseDecorators.PreDestroy);

  if (postConstructDecoratorMetadata !== null) {
    lifecycles.add(LifecycleKind.POST_CONSTRUCT);
  }
  if (preDestroyDecoratorMetadata !== null) {
    lifecycles.add(LifecycleKind.PRE_DESTROY);
  }

  if (lifecycles.size === 0) {
    return node;
  }

  const argumentsLength = getArgumentsLength(node);

  if (argumentsLength > 0) {
    Context.report(new NotSupportedError(
      'Lifecycle elements could not have arguments outside of Configuration classes.',
      node,
      null,
      null,
    ));

    return node;
  }

  if (!node.name) {
    Context.report(new IncorrectNameError(
      'Lifecycle element should have a name.',
      node,
      null,
      null,
    ));

    return node;
  }

  if (!isStaticallyKnownPropertyName(node.name)) {
    Context.report(new NotStaticallyKnownError(
      'Lifecycle element should have statically known name.',
      node,
      null,
      null,
    ));

    return node;
  }

  const classMemberName = getNameFromNodeOrNull(node);

  if (classMemberName === null) {
    Context.report(new NotStaticallyKnownError(
      'Lifecycle element should have statically known name.',
      node,
      null,
      null,
    ));

    return node;
  }

  const componentLifecycle = new ComponentLifecycle({
    lifecycles: lifecycles,
    classMemberName: classMemberName,
    node: node,
  });

  component.lifecycleRegister.register(componentLifecycle);

  if (Context.ts.isMethodDeclaration(node)) {
    return Context.factory.updateMethodDeclaration(
      node,
      filterLibraryModifiers(node.modifiers),
      undefined,
      node.name,
      undefined,
      undefined,
      [],
      node.type,
      node.body,
    );
  }

  return Context.factory.updatePropertyDeclaration(
    node,
    filterLibraryModifiers(node.modifiers),
    node.name,
    node.questionToken,
    node.type,
    node.initializer,
  );
}

function getArgumentsLength(node: ts.MethodDeclaration | ClassPropertyWithArrowFunctionInitializer): number {
  if (Context.ts.isMethodDeclaration(node)) {
    return node.parameters.length;
  }

  return node.initializer.parameters.length;
}
