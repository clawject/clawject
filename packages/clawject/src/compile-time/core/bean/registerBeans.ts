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
        if (isBeanFactoryArrowFunction(configuration, classElement)) {
            registerBeanFactoryArrowFunction(configuration, classElement);
            return;
        }
        if (isBeanValueExpression(configuration, classElement)) {
            registerBeanValueExpression(configuration, classElement);
            return;
        }
        if (isLifecycleMethodBean(classElement) || isLifecycleArrowFunctionBean(classElement)) {
            registerLifecycleBean(configuration, classElement);
            return;
        }
    });

    fillEmbeddedBeans(configuration);
    verifyBeans(configuration);
}
