import { IncorrectTypeError } from '../../compilation-context/messages/errors/IncorrectTypeError';
import { DITypeFlag } from '../type-system/DITypeFlag';
import { Configuration } from '../configuration/Configuration';
import { Bean } from './Bean';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { NotSupportedError } from '../../compilation-context/messages/errors/NotSupportedError';
import { isStaticallyKnownPropertyName } from '../ts/predicates/isStaticallyKnownPropertyName';
import ts from 'typescript';
import { DuplicateNameError } from '../../compilation-context/messages/errors/DuplicateNameError';
import { BeanKind } from './BeanKind';
import { MissingInitializerError } from '../../compilation-context/messages/errors/MissingInitializerError';
import { NotStaticallyKnownError } from '../../compilation-context/messages/errors/NotStaticallyKnownError';
import { ClassPropertyWithArrowFunctionInitializer } from '../ts/types';
import { ConfigLoader } from '../../config/ConfigLoader';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { DIType } from '../type-system/DIType';

const UNSUPPORTED_TYPES = new Map<DITypeFlag, string>([
  [DITypeFlag.UNRESOLVABLE, 'unresolvable'],
  [DITypeFlag.UNSUPPORTED, 'unsupported'],
  [DITypeFlag.ANONYMOUS, 'anonymous'],
  [DITypeFlag.NEVER, 'never'],
  [DITypeFlag.VOID, 'void'],
  [DITypeFlag.UNDEFINED, 'undefined'],
  [DITypeFlag.NULL, 'null'],
  [DITypeFlag.UNION, 'union'],
  [DITypeFlag.SYMBOL, 'symbol'],
]);
const RESTRICTED_MODIFIERS = new Map<ts.SyntaxKind, string>([
  [ts.SyntaxKind.AbstractKeyword, 'abstract'],
  [ts.SyntaxKind.StaticKeyword, 'static'],
  [ts.SyntaxKind.DeclareKeyword, 'declare'],
  [ts.SyntaxKind.PrivateKeyword, 'private'],
]);

export const verifyBeans = (configuration: Configuration): void => {
  const beans = configuration.beanRegister.elements;

  verifyBeanNameUniqueness(beans);

  beans.forEach(bean => {
    verifyBeanType(bean);
    verifyName(bean);
    verifyModifiers(bean);
    verifyBeanInitializers(bean);
  });
};

export function verifyBeanNameUniqueness(beans: Set<Bean>): void {
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
      const compilationContext = getCompilationContext();
      compilationContext.report(new DuplicateNameError(
        null,
        bean.node.name,
        beanParentConfiguration,
        duplicatedBeans,
      ));
    }
  });
}

export function verifyBeanType(bean: Bean): void {
  const parentConfiguration = bean.parentConfiguration;
  const compilationContext = getCompilationContext();

  if (bean.isLifecycle()) {
    // Lifecycle methods can return anything
    return;
  }

  let beanType = bean.diType;

  const beanTypeNode = bean.typeRef.getAndDisposeSafe();

  if (beanTypeNode !== null) {
    const awaited = DITypeBuilder.getPromisedTypeOfPromise(beanTypeNode) ?? beanTypeNode;
    beanType = DITypeBuilder.build(awaited);
  }

  if (UNSUPPORTED_TYPES.has(beanType.typeFlag)) {
    let typeNode = bean.node.type;

    if (bean.kind === BeanKind.FACTORY_ARROW_FUNCTION) {
      typeNode = (bean.node as ClassPropertyWithArrowFunctionInitializer).initializer.type;
    }

    compilationContext.report(new IncorrectTypeError(
      `Type '${UNSUPPORTED_TYPES.get(bean.diType.typeFlag)}' not supported as a Bean type.`,
      typeNode ?? bean.node,
      parentConfiguration,
    ));
    parentConfiguration.beanRegister.deregister(bean);
    return;
  }
}


function verifyName(bean: Bean): void {
  const compilationContext = getCompilationContext();
  const name = bean.node.name;

  if (isStaticallyKnownPropertyName(name)) {
    return;
  }

  compilationContext.report(new NotStaticallyKnownError(
    'Bean element should have statically known name.',
    bean.node.name,
    bean.parentConfiguration
  ));
  bean.parentConfiguration.beanRegister.deregister(bean);
}

function verifyModifiers(bean: Bean): void {
  const compilationContext = getCompilationContext();
  const restrictedModifier = bean.node.modifiers?.find(it => RESTRICTED_MODIFIERS.has(it.kind));

  if (!restrictedModifier) {
    return;
  }

  compilationContext.report(new NotSupportedError(
    `Bean declaration should not have modifier ${RESTRICTED_MODIFIERS.get(restrictedModifier.kind)}.`,
    bean.node.name,
    bean.parentConfiguration
  ));
  bean.parentConfiguration.beanRegister.deregister(bean);
}

function verifyBeanInitializers(bean: Bean): void {
  const compilationContext = getCompilationContext();

  if (!ts.isPropertyDeclaration(bean.node)) {
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

    compilationContext.report(new MissingInitializerError(
      null,
      bean.node,
      bean.parentConfiguration
    ));
    bean.parentConfiguration.beanRegister.deregister(bean);
  }
}
