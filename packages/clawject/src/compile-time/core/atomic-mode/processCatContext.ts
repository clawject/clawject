import ts from 'typescript';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { IncorrectNameError } from '../../compilation-context/messages/errors/IncorrectNameError';
import { registerBeans } from '../bean/registerBeans';
import { checkIsAllBeansRegisteredInContextAndFillBeanRequierness } from '../bean/checkIsAllBeansRegisteredInContextAndFillBeanRequierness';
import { registerBeanDependencies } from '../dependency/registerBeanDependencies';
import { buildDependencyGraphAndFillQualifiedBeans } from '../dependencies/buildDependencyGraphAndFillQualifiedBeans';
import { reportAboutCircularDependencies } from '../report-cyclic-dependencies/reportAboutCircularDependencies';
import { enrichWithAdditionalProperties } from './transformers/enrichWithAdditionalProperties';
import { processMembers } from './transformers/processMembers';
import { BeanKind } from '../bean/BeanKind';
import { isNameReserved } from '../utils/isNameReserved';

const ALLOWED_BEAN_KINDS = new Set([
    BeanKind.FACTORY_METHOD,
    BeanKind.CLASS_CONSTRUCTOR_BEAN,
    BeanKind.FACTORY_ARROW_FUNCTION,
    BeanKind.VALUE_EXPRESSION,
    BeanKind.LIFECYCLE_METHOD,
    BeanKind.LIFECYCLE_ARROW_FUNCTION,
]);

export function processCatContext(node: ts.ClassDeclaration, compilationContext: CompilationContext): ts.Node {
    const context = ConfigurationRepository.register(node, ALLOWED_BEAN_KINDS);

    const restrictedClassMembersByName = node.members
        .filter(it => isNameReserved(it.name?.getText() ?? ''));

    if (restrictedClassMembersByName.length !== 0) {
        restrictedClassMembersByName.forEach(it => {
            compilationContext.report(new IncorrectNameError(
                `"${it.name?.getText()}" name is reserved for the di-container.`,
                it,
                context.node,
            ));
        });
        return node;
    }

    //Processing beans
    registerBeans(context);
    checkIsAllBeansRegisteredInContextAndFillBeanRequierness(context);
    registerBeanDependencies(context);
    buildDependencyGraphAndFillQualifiedBeans(context);
    reportAboutCircularDependencies(context);

    const enrichedWithAdditionalProperties = enrichWithAdditionalProperties(node, context);
    // const replacedExtendingFromCatContext = replaceExtendingFromCatContext(enrichedWithAdditionalProperties);
    const withProcessedMembers = processMembers(enrichedWithAdditionalProperties, context);

    return withProcessedMembers;
}
