import { isMethodBean } from '../ts/predicates/isMethodBean';
import { registerMethodBean } from './registerMethodBean';
import { isClassPropertyBean } from '../ts/predicates/isClassPropertyBean';
import { registerPropertyBean } from './registerPropertyBean';
import { isArrowFunctionBean } from '../ts/predicates/isArrowFunctionBean';
import { registerArrowFunctionBean } from './registerArrowFunctionBean';
import { isExpressionBean } from '../ts/predicates/isExpressionBean';
import { registerExpressionBean } from './registerExpressionBean';
import { isEmbeddedBean } from '../ts/predicates/isEmbeddedBean';
import { registerEmbeddedBean } from './registerEmbeddedBeans';
import { verifyBeans } from './verifyBeans';
import { isLifecycleMethodBean } from '../ts/predicates/isLifecycleMethodBean';
import { registerLifecycleBean } from './registerLifecycleBean';
import { isLifecycleArrowFunctionBean } from '../ts/predicates/isLifecycleArrowFunctionBean';
import { Configuration } from '../configuration/Configuration';

export function registerBeans(configuration: Configuration): void {
    configuration.node.members.forEach((classElement) => {
        if (isMethodBean(classElement)) {
            registerMethodBean(configuration, classElement);
        }
        if (isClassPropertyBean(classElement)) {
            registerPropertyBean(configuration, classElement);
        }
        if (isArrowFunctionBean(configuration, classElement)) {
            registerArrowFunctionBean(configuration, classElement);
        }
        if (isExpressionBean(configuration, classElement)) {
            registerExpressionBean(configuration, classElement);
        }
        if (isEmbeddedBean(configuration, classElement)) {
            registerEmbeddedBean(configuration, classElement);
        }
        if (isLifecycleMethodBean(classElement) || isLifecycleArrowFunctionBean(configuration, classElement)) {
            registerLifecycleBean(configuration, classElement);
        }
    });

    verifyBeans(configuration);
}
