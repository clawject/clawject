import { IncorrectTypeError } from '../../compilation-context/messages/errors/IncorrectTypeError';
import { Configuration } from '../configuration/Configuration';
import { Bean } from './Bean';
import { NotSupportedError } from '../../compilation-context/messages/errors/NotSupportedError';
import { isStaticallyKnownPropertyName } from '../ts/predicates/isStaticallyKnownPropertyName';
import type * as ts from 'typescript';
import { DuplicateNameError } from '../../compilation-context/messages/errors/DuplicateNameError';
import { BeanKind } from './BeanKind';
import { MissingInitializerError } from '../../compilation-context/messages/errors/MissingInitializerError';
import { NotStaticallyKnownError } from '../../compilation-context/messages/errors/NotStaticallyKnownError';
import { ClassPropertyWithArrowFunctionInitializer } from '../ts/types';
import { Application } from '../application/Application';
import { Context } from '../../compilation-context/Context';

export const verifyBeans = (configuration: Configuration): void => {
  const beans = configuration.beanRegister.elements;

  verifyBeanNameUniqueness(beans, null);

  beans.forEach(bean => {
    verifyBeanType(bean);
    verifyName(bean);
    verifyModifiers(bean);
    verifyBeanInitializers(bean);
  });
};

export function verifyBeanNameUniqueness(beans: Set<Bean> | Bean[], application: Application | null): void {
  const nameToBeans = new Map<string, Bean[]>();

  beans.forEach(bean => {
    const name = bean.fullName;

    const beans = nameToBeans.get(name) ?? [];
    beans.push(bean);
    nameToBeans.set(name, beans);
  });

  beans.forEach(bean => {
    const beanParentConfiguration = bean.parentConfiguration;
    const beansByName = nameToBeans.get(bean.fullName) ?? [];
    let duplicatedBeans: Bean[];

    if (bean.getExternalValue()) {
      duplicatedBeans = beansByName.filter(it => {
        const isInternal = !it.getExternalValue();
        if (isInternal && it.parentConfiguration !== beanParentConfiguration) {
          return false;
        }

        return it !== bean;
      });
    } else {
      duplicatedBeans = beansByName.filter(it => {
        return it !== bean && it.parentConfiguration === beanParentConfiguration;
      });
    }

    if (duplicatedBeans.length > 0) {
      Context.report(new DuplicateNameError(
        null,
        bean.node.name,
        beanParentConfiguration,
        application,
        duplicatedBeans,
      ));
    }
  });
}

export function verifyBeanType(bean: Bean): void {
  const parentConfiguration = bean.parentConfiguration;

  if (bean.isLifecycle()) {
    // Lifecycle methods can return anything
    return;
  }

  const beanType = bean.cType.getPromisedType() ?? bean.cType;

  let errorTypeName: string | null = null;

  switch (true) {
  case beanType.isNever():
    errorTypeName = 'never';
    break;

  case beanType.isUndefined():
    errorTypeName = 'undefined';
    break;

  case beanType.isVoid():
  case beanType.isVoidLike():
    errorTypeName = 'void';
    break;

  case beanType.isNull():
    errorTypeName = 'null';
    break;
  }

  if (errorTypeName !== null) {
    let typeNode = bean.node.type;

    if (bean.kind === BeanKind.FACTORY_ARROW_FUNCTION) {
      typeNode = (bean.node as ClassPropertyWithArrowFunctionInitializer).initializer.type;
    }

    Context.report(new IncorrectTypeError(
      `Type '${errorTypeName}' not supported as a Bean type.`,
      typeNode ?? bean.node,
      parentConfiguration,
      null,
    ));
    parentConfiguration.beanRegister.deregister(bean);
  }
}


function verifyName(bean: Bean): void {
  const name = bean.node.name;

  if (isStaticallyKnownPropertyName(name)) {
    return;
  }

  Context.report(new NotStaticallyKnownError(
    'Bean element should have statically known name.',
    bean.node.name,
    bean.parentConfiguration,
    null,
  ));
  bean.parentConfiguration.beanRegister.deregister(bean);
}

function verifyModifiers(bean: Bean): void {
  const RESTRICTED_MODIFIERS = new Map<ts.SyntaxKind, string>([
    [Context.ts.SyntaxKind.AbstractKeyword, 'abstract'],
    [Context.ts.SyntaxKind.StaticKeyword, 'static'],
    [Context.ts.SyntaxKind.DeclareKeyword, 'declare'],
    [Context.ts.SyntaxKind.PrivateKeyword, 'private'],
  ]);

  const restrictedModifier = bean.node.modifiers?.find(it => RESTRICTED_MODIFIERS.has(it.kind));

  if (!restrictedModifier) {
    return;
  }

  Context.report(new NotSupportedError(
    `Bean declaration should not have modifier ${RESTRICTED_MODIFIERS.get(restrictedModifier.kind)}.`,
    bean.node.name,
    bean.parentConfiguration,
    null
  ));
  bean.parentConfiguration.beanRegister.deregister(bean);
}

function verifyBeanInitializers(bean: Bean): void {

  if (!Context.ts.isPropertyDeclaration(bean.node)) {
    return;
  }

  if (
    bean.kind === BeanKind.FACTORY_ARROW_FUNCTION
    || bean.kind === BeanKind.VALUE_EXPRESSION
    || bean.kind === BeanKind.LIFECYCLE_ARROW_FUNCTION
  ) {
    const initializer = bean.node.initializer;

    if (initializer) {
      return;
    }

    Context.report(new MissingInitializerError(
      null,
      bean.node,
      bean.parentConfiguration,
      null
    ));
    bean.parentConfiguration.beanRegister.deregister(bean);
  }
}
