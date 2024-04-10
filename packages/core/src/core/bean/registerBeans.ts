import { isBeanFactoryMethod } from '../ts/predicates/isBeanFactoryMethod';
import { registerBeanFactoryMethod } from './registerBeanFactoryMethod';
import { isBeanClassConstructor } from '../ts/predicates/isBeanClassConstructor';
import { registerBeanClassConstructor } from './registerBeanClassConstructor';
import { isBeanFactoryArrowFunction } from '../ts/predicates/isBeanFactoryArrowFunction';
import { registerBeanFactoryArrowFunction } from './registerBeanFactoryArrowFunction';
import { isBeanValueExpression } from '../ts/predicates/isBeanValueExpression';
import { registerBeanValueExpression } from './registerBeanValueExpression';
import { verifyBeans } from './verifyBeans';
import { isLifecycleMethodBean } from '../ts/predicates/isLifecycleMethodBean';
import { registerLifecycleBean } from './registerLifecycleBean';
import { isLifecycleArrowFunctionBean } from '../ts/predicates/isLifecycleArrowFunctionBean';
import { Configuration } from '../configuration/Configuration';
import { fillEmbeddedBeans } from './fillEmbeddedBeans';
import { NotSupportedError } from '../../compilation-context/messages/errors/NotSupportedError';
import { fillBeanTypes } from './fillBeanTypes';
import { Context } from '../../compilation-context/Context';
import { DecoratorProcessor } from '../decorators/DecoratorProcessor';
import { BaseDecorators } from '../decorators/BaseDecorators';

//TODO Consider resolve type of class element, and based on type resolve bean kind, also make less bean kinds
export function registerBeans(configuration: Configuration): void {
  configuration.node.members.forEach((classElement) => {
    if (isBeanFactoryMethod(classElement)) {
      registerBeanFactoryMethod(configuration, classElement);
      return;
    }
    if (isBeanClassConstructor(classElement)) {
      registerBeanClassConstructor(configuration, classElement);
      return;
    }
    if (isBeanFactoryArrowFunction(classElement)) {
      registerBeanFactoryArrowFunction(configuration, classElement);
      return;
    }
    if (isBeanValueExpression(classElement)) {
      registerBeanValueExpression(configuration, classElement);
      return;
    }
    if (isLifecycleMethodBean(classElement) || isLifecycleArrowFunctionBean(classElement)) {
      registerLifecycleBean(configuration, classElement);
      return;
    }

    // Fail fast
    const beanMetadata = DecoratorProcessor.extractFirstDecoratorEntity(classElement, BaseDecorators.Bean);

    if (beanMetadata !== null) {
      Context.report(new NotSupportedError(
        'Unknown Bean target.',
        classElement,
        configuration,
        null,
      ));
      return;
    }
  });

  fillBeanTypes(configuration);
  fillEmbeddedBeans(configuration);
  verifyBeans(configuration);
}
