import ts from 'typescript';
import { unquoteString } from '../../utils/unquoteString';
import { CONSTANTS } from '../../../../constants';
import { getCompilationContext } from '../../../../transformer/getCompilationContext';
import { DITypeBuilder } from '../../type-system/DITypeBuilder';
import { BaseTypesRepository } from '../../type-system/BaseTypesRepository';
import { EntrypointRepository } from './EntrypointRepository';
import { NotSupportedError } from '../../../compilation-context/messages/errors/NotSupportedError';

export const registerEntrypoint = (sourceFile: ts.SourceFile, tsContext: ts.TransformationContext): void => {
    const hasLibraryImport = sourceFile.statements.some(statement =>
        ts.isImportDeclaration(statement) && unquoteString(statement.moduleSpecifier.getText()) === CONSTANTS.libraryName,
    );

    if (!hasLibraryImport) {
        return;
    }

    const visitor = (node: ts.Node): ts.Node | ts.Node[] => {
        if (!ts.isCallExpression(node)) {
            return ts.visitEachChild(node, visitor, tsContext);
        }

        const compilationContext = getCompilationContext();
        const typeChecker = compilationContext.typeChecker;

        const type = typeChecker.getTypeAtLocation(node.expression);
        const diType = DITypeBuilder.build(type);
        const isClawjectApplicationRunCall = diType.isCompatible(BaseTypesRepository.getBaseTypes().runClawjectApplication);

        if (!isClawjectApplicationRunCall) {
            return ts.visitEachChild(node, visitor, tsContext);
        }

        if (EntrypointRepository.entrypointFileName !== null) {
            compilationContext.report(new NotSupportedError(
                'Multiple application entrypoints are not supported.',
                node,
                null,
            ));
            return node;
        }

        EntrypointRepository.entrypointFileName = sourceFile.fileName;

        return node;
    };

    ts.visitNode(sourceFile, visitor);
};
