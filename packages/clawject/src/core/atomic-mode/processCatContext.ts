import ts from 'typescript';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { IncorrectNameError } from '../../compilation-context/messages/errors/IncorrectNameError';
import { registerBeans } from '../bean/registerBeans';
import { checkIsAllBeansRegisteredInContextAndFillBeanRequierness } from '../bean/checkIsAllBeansRegisteredInContextAndFillBeanRequierness';
import { registerBeanDependencies } from '../dependency/registerBeanDependencies';
import { buildDependencyGraphAndFillQualifiedBeans } from '../dependencies/buildDependencyGraphAndFillQualifiedBeans';
import { reportAboutCyclicDependencies } from '../report-cyclic-dependencies/reportAboutCyclicDependencies';
import { enrichWithAdditionalProperties } from './transformers/enrichWithAdditionalProperties';
import { replaceExtendingFromCatContext } from './transformers/replaceExtendingFromCatContext';
import { processMembers } from './transformers/processMembers';
import { BeanKind } from '../bean/BeanKind';
import { isReservedRuntimeNameForContext } from '../runtime-element/RuntimeElement';

const ALLOWED_BEAN_KINDS = new Set([
    BeanKind.METHOD,
    BeanKind.PROPERTY,
    BeanKind.ARROW_FUNCTION,
    BeanKind.EXPRESSION,
    BeanKind.EMBEDDED,
    BeanKind.LIFECYCLE_METHOD,
    BeanKind.LIFECYCLE_ARROW_FUNCTION,
]);

export function processCatContext(node: ts.ClassDeclaration, visitor: ts.Visitor, compilationContext: CompilationContext, tsContext: ts.TransformationContext): ts.Node {
    const context = ConfigurationRepository.register(node, ALLOWED_BEAN_KINDS);

    const restrictedClassMembersByName = node.members
        .filter(it => isReservedRuntimeNameForContext(it.name?.getText() ?? ''));

    if (restrictedClassMembersByName.length !== 0) {
        restrictedClassMembersByName.forEach(it => {
            compilationContext.report(new IncorrectNameError(
                `"${it.name?.getText()}" name is reserved for the di-container.`,
                it,
                context.node,
            ));
        });
        return ts.visitEachChild(node, visitor, tsContext);
    }

    //Processing beans
    registerBeans(context);
    checkIsAllBeansRegisteredInContextAndFillBeanRequierness(context);
    registerBeanDependencies(context);
    buildDependencyGraphAndFillQualifiedBeans(context);
    reportAboutCyclicDependencies(context);

    const enrichedWithAdditionalProperties = enrichWithAdditionalProperties(node, context);
    const replacedExtendingFromCatContext = replaceExtendingFromCatContext(enrichedWithAdditionalProperties);
    const withProcessedMembers = processMembers(replacedExtendingFromCatContext, context);

    return withProcessedMembers;
}
