import { IncorrectTypeError } from '../../compilation-context/messages/errors/IncorrectTypeError';
import { DITypeFlag } from '../type-system/DITypeFlag';
import { Configuration } from '../configuration/Configuration';
import { Bean } from './Bean';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { NotSupportedError } from '../../compilation-context/messages/errors/NotSupportedError';
import { isStaticallyKnownPropertyName } from '../ts/predicates/isStaticallyKnownPropertyName';
import ts from 'typescript';
import { DuplicateNameError } from '../../compilation-context/messages/errors/DuplicateNameError';

const UNSUPPORTED_TYPES = new Set([
  DITypeFlag.UNSUPPORTED,
  DITypeFlag.NEVER,
  DITypeFlag.VOID,
  DITypeFlag.UNDEFINED,
]);
const RESTRICTED_MODIFIERS = new Map<ts.SyntaxKind, string>([
  [ts.SyntaxKind.AbstractKeyword, 'abstract'],
  [ts.SyntaxKind.StaticKeyword, 'static'],
  [ts.SyntaxKind.DeclareKeyword, 'declare'],
]);

export const verifyBeans = (configuration: Configuration): void => {
  const beans = configuration.beanRegister.elements;

  verifyNameUniqueness(beans);

  beans.forEach(bean => {
    verifyBeanType(bean);
    verifyName(bean);
    verifyModifiers(bean);
  });
};

function verifyNameUniqueness(beans: Set<Bean>): void {
  const nameToBeans = new Map<string, Bean[]>();

  beans.forEach(bean => {
    const name = bean.fullName;

    const beans = nameToBeans.get(name) ?? [];
    beans.push(bean);
    nameToBeans.set(name, beans);
  });

  beans.forEach(bean => {
    const beansByName = nameToBeans.get(bean.fullName) ?? [];

    if (beansByName.length > 1) {
      const compilationContext = getCompilationContext();
      compilationContext.report(new DuplicateNameError(
        null,
        bean.node.name,
        bean.parentConfiguration,
        beansByName.filter(it => it !== bean),
      ));
    }
  });
}

function verifyBeanType(bean: Bean): void {
  const parentConfiguration = bean.parentConfiguration;
  const compilationContext = getCompilationContext();

  if (bean.isLifecycle()) {
    // Lifecycle methods can return anything
    return;
  }

  if (bean.diType.isUnion) {
    compilationContext.report(new IncorrectTypeError(
      'Union type is not supported as a Bean type.',
      bean.node.type ?? bean.node,
      parentConfiguration,
    ));
    parentConfiguration.beanRegister.deregister(bean);
    return;
  }

  if (UNSUPPORTED_TYPES.has(bean.diType.typeFlag)) {
    compilationContext.report(new IncorrectTypeError(
      'Unsupported type for Bean.',
      bean.node.type ?? bean.node,
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

  compilationContext.report(new NotSupportedError(
    'Bean name should be statically known.',
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
