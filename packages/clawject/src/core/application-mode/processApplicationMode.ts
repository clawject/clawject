import ts from 'typescript';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { getDecoratorsOnly } from '../ts/utils/getDecoratorsOnly';
import { isDecoratorFromLibrary } from '../ts/predicates/isDecoratorFromLibrary';
import { processAutowiredMember } from './processAutowiredMember';
import { processClassMembers } from './processClassMembers';

export const processApplicationMode = (compilationContext: CompilationContext, tsContext: ts.TransformationContext, sourceFile: ts.SourceFile): ts.SourceFile => {
    //Skipping declaration files for now, maybe in future - there could be declared some configurations/services/etc
    if (sourceFile.isDeclarationFile) {
        return sourceFile;
    }

    const shouldAddImports = false;

    const visitor = (node: ts.Node): ts.Node => {
        if (!ts.isClassDeclaration(node)) {
            return ts.visitEachChild(node, visitor, tsContext);
        }

        //Registering configuration classes
        const classDecorators = getDecoratorsOnly(node);
        const configurationDecorators = classDecorators
            .find(it => isDecoratorFromLibrary(it, 'Configuration'));

        processClassMembers(compilationContext, node);

        return ts.visitEachChild(node, visitor, tsContext);

        // shouldAddImports = true;
        //
        // const context = ContextRepository.register(node);
        //
        // const restrictedClassMembersByName = node.members
        //     .filter(it => InternalCatContext.reservedNames.has(it.name?.getText() ?? ''));
        //
        // if (restrictedClassMembersByName.length !== 0) {
        //     restrictedClassMembersByName.forEach(it => {
        //         compilationContext.report(new IncorrectNameError(
        //             `"${it.name?.getText()}" name is reserved for the di-container.`,
        //             it,
        //             context.node,
        //         ));
        //     });
        //     return ts.visitEachChild(node, visitor, tsContext);
        // }
        //
        // //Processing beans
        // registerBeans(compilationContext, context);
        // checkIsAllBeansRegisteredInContextAndFillBeanRequierness(compilationContext, context);
        // registerBeanDependencies(compilationContext, context);
        // buildDependencyGraphAndFillQualifiedBeans(compilationContext, context);
        // reportAboutCyclicDependencies(compilationContext, context);
        //
        // const enrichedWithAdditionalProperties = enrichWithAdditionalProperties(node, context);
        // const replacedExtendingFromCatContext = replaceExtendingFromCatContext(enrichedWithAdditionalProperties);
        // const withProcessedMembers = processMembers(replacedExtendingFromCatContext, context);
        //
        // return withProcessedMembers;
    };

    return sourceFile;

    // const transformedFile = ts.visitNode(sourceFile, visitor);
    //
    // const updatedStatements = Array.from(transformedFile.statements);
    //
    // if (shouldAddImports) {
    //     const pathForInternalCatContext = upath.join(
    //         getImportPathToExternalDirectory(),
    //         'InternalCatContext',
    //     );
    //     const internalCatContextImport = factory.createImportDeclaration(
    //         undefined,
    //         factory.createImportClause(
    //             false,
    //             undefined,
    //             factory.createNamespaceImport(
    //                 factory.createIdentifier(INTERNAL_CAT_CONTEXT_IMPORT)
    //             )
    //         ),
    //         factory.createStringLiteral(pathForInternalCatContext)
    //     );
    //
    //     updatedStatements.unshift(internalCatContextImport);
    // }
    //
    // return ts.factory.updateSourceFile(
    //     sourceFile,
    //     updatedStatements,
    //     sourceFile.isDeclarationFile,
    //     sourceFile.referencedFiles,
    //     sourceFile.typeReferenceDirectives,
    //     sourceFile.hasNoDefaultLib,
    //     sourceFile.libReferenceDirectives,
    // );
};
