import ts from 'typescript';
import { registerMethodBeanDependencies } from './registerMethodBeanDependencies';
import { registerPropertyBeanDependencies } from './registerPropertyBeanDependencies';
import { ClassPropertyWithArrowFunctionInitializer, ClassPropertyWithCallExpressionInitializer } from '../ts/types';
import { registerArrowFunctionBeanDependencies } from './registerArrowFunctionBeanDependencies';
import { Configuration } from '../configuration/Configuration';
import { BeanKind } from '../bean/BeanKind';
import { Bean } from '../bean/Bean';

export const registerBeanDependencies = (configuration: Configuration) => {
    configuration.beanRegister.elements.forEach(bean => {
        switch (bean.kind) {
        case BeanKind.CLASS_CONSTRUCTOR_BEAN:
            registerPropertyBeanDependencies(bean as Bean<ClassPropertyWithCallExpressionInitializer>);
            break;

        case BeanKind.FACTORY_METHOD:
        case BeanKind.LIFECYCLE_METHOD:
            registerMethodBeanDependencies(bean as Bean<ts.MethodDeclaration>);
            break;

        case BeanKind.FACTORY_ARROW_FUNCTION:
        case BeanKind.LIFECYCLE_ARROW_FUNCTION:
            registerArrowFunctionBeanDependencies(bean as Bean<ClassPropertyWithArrowFunctionInitializer>);
            break;
        }
    });
};
