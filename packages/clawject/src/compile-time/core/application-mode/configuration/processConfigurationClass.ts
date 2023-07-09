import ts from 'typescript';
import { ConfigurationRepository } from '../../configuration/ConfigurationRepository';
import { BeanKind } from '../../bean/BeanKind';
import { registerBeans } from '../../bean/registerBeans';
import { registerBeanDependencies } from '../../dependency/registerBeanDependencies';
import { registerAutowired } from '../../autowired/registerAutowired';
import { getCompilationContext } from '../../../../transformer/getCompilationContext';
import { NotSupportedError } from '../../../compilation-context/messages/errors/NotSupportedError';
import { transformConfigurationClass } from './transformation/transformConfigurationClass';

const ALLOWED_BEAN_KINDS = new Set([
    BeanKind.FACTORY_METHOD,
    BeanKind.CLASS_CONSTRUCTOR,
    BeanKind.FACTORY_ARROW_FUNCTION,
    BeanKind.VALUE_EXPRESSION,
    BeanKind.LIFECYCLE_METHOD,
    BeanKind.LIFECYCLE_ARROW_FUNCTION,
]);

//TODO consider allowing constructor parameters in configuration classes
export const processConfigurationClass = (node: ts.ClassDeclaration): ts.ClassDeclaration => {
    const compilationContext = getCompilationContext();
    const configuration = ConfigurationRepository.register(node, ALLOWED_BEAN_KINDS);

    if (node.members.some(ts.isConstructorDeclaration)) {
        compilationContext.report(new NotSupportedError(
            'Configuration classes cannot have constructor.',
            node,
            null,
        ));
        return node;
    }

    registerBeans(configuration);
    registerBeanDependencies(configuration);
    registerAutowired(configuration);

    return transformConfigurationClass(configuration);
};
