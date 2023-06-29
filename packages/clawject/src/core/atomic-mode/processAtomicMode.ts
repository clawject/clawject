import ts from 'typescript';
import { isExtendsClassFromLibrary } from '../ts/predicates/isExtendsClassFromLibrary';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { registerBeans } from '../bean/registerBeans';
import { checkIsAllBeansRegisteredInContextAndFillBeanRequierness } from '../bean/checkIsAllBeansRegisteredInContextAndFillBeanRequierness';
import { registerBeanDependencies } from '../dependency/registerBeanDependencies';
import { reportAboutCyclicDependencies } from '../report-cyclic-dependencies/reportAboutCyclicDependencies';
import { enrichWithAdditionalProperties } from './transformers/enrichWithAdditionalProperties';
import { InternalCatContext } from '../../external/internal/InternalCatContext';
import { IncorrectNameError } from '../../compilation-context/messages/errors/IncorrectNameError';
import { replaceExtendingFromCatContext } from './transformers/replaceExtendingFromCatContext';
import { processMembers } from './transformers/processMembers';
import { ConfigurationRepository } from '../configuration/ConfigurationRepository';
import { buildDependencyGraphAndFillQualifiedBeans } from '../dependencies/buildDependencyGraphAndFillQualifiedBeans';
import { BeanKind } from '../bean/BeanKind';
import { InternalsAccessBuilder } from '../internals-access/InternalsAccessBuilder';
import { processCatContext } from './processCatContext';
import { processImplicitComponents } from './processImplicitComponents';

const ALLOWED_BEAN_KINDS = new Set([
    BeanKind.METHOD,
    BeanKind.PROPERTY,
    BeanKind.ARROW_FUNCTION,
    BeanKind.EXPRESSION,
    BeanKind.EMBEDDED,
    BeanKind.LIFECYCLE_METHOD,
    BeanKind.LIFECYCLE_ARROW_FUNCTION,
]);


export const processAtomicMode = (compilationContext: CompilationContext, tsContext: ts.TransformationContext, sourceFile: ts.SourceFile): ts.SourceFile => {
    //Skipping declaration files
    if (sourceFile.isDeclarationFile) {
        return sourceFile;
    }

    let shouldAddImports = false;

    const visitor = (node: ts.Node): ts.Node => {
        if (!ts.isClassDeclaration(node)) {
            return ts.visitEachChild(node, visitor, tsContext);
        }

        //Registering contexts
        if (isExtendsClassFromLibrary(node, 'CatContext')) {
            shouldAddImports = true;

            return processCatContext(node, visitor, compilationContext, tsContext);
        }

        return processImplicitComponents(() => (shouldAddImports = true), node, visitor, compilationContext, tsContext);
    };

    const transformedFile = ts.visitNode(sourceFile, visitor);

    const updatedStatements = Array.from(transformedFile.statements);

    if (shouldAddImports) {
        updatedStatements.unshift(InternalsAccessBuilder.importDeclarationToInternal());
    }

    return ts.factory.updateSourceFile(
        sourceFile,
        updatedStatements,
        sourceFile.isDeclarationFile,
        sourceFile.referencedFiles,
        sourceFile.typeReferenceDirectives,
        sourceFile.hasNoDefaultLib,
        sourceFile.libReferenceDirectives,
    );
};
