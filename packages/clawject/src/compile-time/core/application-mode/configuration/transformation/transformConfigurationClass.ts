import ts, { factory } from 'typescript';
import { Configuration } from '../../../configuration/Configuration';
import { transformAutowiredMember } from './transformAutowiredMember';
import { Bean, BeanNode } from '../../../bean/Bean';
import { BeanKind } from '../../../bean/BeanKind';
import { transformBeanClassConstructor } from '../../../atomic-mode/transformers/transformBeanClassConstructor';
import { ClassPropertyWithArrowFunctionInitializer, ClassPropertyWithCallExpressionInitializer, ClassPropertyWithExpressionInitializer } from '../../../ts/types';
import { transformArrowFunctionOrExpressionBean } from '../../../atomic-mode/transformers/transformArrowFunctionOrExpressionBean';
import { transformConfigurationMethodBean } from './transformConfigurationMethodBean';

export const transformConfigurationClass = (configuration: Configuration): ts.ClassDeclaration => {
  const classDeclaration = configuration.node;
  const updatedMembers = classDeclaration.members.map(member => {
    const autowired = configuration.autowiredRegister.getByNode(member);
    const bean = configuration.beanRegister.getByNode(member as BeanNode);

    if (autowired !== null) {
      return transformAutowiredMember(autowired, member);
    }

    if (bean !== null) {
      switch (bean.kind) {
      case BeanKind.FACTORY_METHOD:
      case BeanKind.LIFECYCLE_METHOD:
        return transformConfigurationMethodBean(bean as Bean<ts.MethodDeclaration>);

      case BeanKind.CLASS_CONSTRUCTOR:
        return transformBeanClassConstructor(bean as Bean<ClassPropertyWithCallExpressionInitializer>);

      case BeanKind.FACTORY_ARROW_FUNCTION:
      case BeanKind.LIFECYCLE_ARROW_FUNCTION:
      case BeanKind.VALUE_EXPRESSION:
        return transformArrowFunctionOrExpressionBean(bean as Bean<ClassPropertyWithArrowFunctionInitializer | ClassPropertyWithExpressionInitializer>);
      }
    }

    return member;
  });

  return factory.updateClassDeclaration(
    classDeclaration,
    classDeclaration.modifiers,
    classDeclaration.name,
    classDeclaration.typeParameters,
    classDeclaration.heritageClauses,
    [
      ...updatedMembers,
    ]
  );
};
