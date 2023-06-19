import ts from 'typescript';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { getDecoratorsOnly } from '../ts/utils/getDecoratorsOnly';
import { isDecoratorFromLibrary } from '../ts/predicates/isDecoratorFromLibrary';
import { processConfigurationClass } from './configuration/processConfigurationClass';
import { processComponent } from './component/processComponent';
import { NotSupportedError } from '../../compilation-context/messages/errors/NotSupportedError';
import { registerEntrypoint } from './registerEntrypoint';

export const processApplicationMode = (compilationContext: CompilationContext, tsContext: ts.TransformationContext, sourceFile: ts.SourceFile): ts.SourceFile => {
    //Skipping declaration files for now, maybe in future - there could be declared some configurations/services/etc
    if (sourceFile.isDeclarationFile) {
        return sourceFile;
    }

    let shouldAddImports = false;

    //TODO create function that will register entrypoint and verify all classes for not allowed and members
    registerEntrypoint(sourceFile, tsContext);

    //Processing only top level statements
    //TODO inspect nested statements for not allowed decorators
    const updatedStatements = sourceFile.statements.map(statement => {
        if (!ts.isClassDeclaration(statement)) {
            return statement;
        }

        const classDecorators = getDecoratorsOnly(statement);

        const isComponent = classDecorators.some(it => isDecoratorFromLibrary(it, 'Component'));
        const isConfiguration = classDecorators.some(it => isDecoratorFromLibrary(it, 'Configuration'));

        if (isComponent && isConfiguration) {
            compilationContext.report(new NotSupportedError(
                //TODO use stereotype names instead of @Component
                'Class cannot be both @Component and @Configuration',
                statement,
                null,
            ));
            return statement;
        }

        if (isConfiguration) {
            shouldAddImports = true;
            return processConfigurationClass(statement);
        }

        if (isComponent) {
            shouldAddImports = true;
            processComponent(statement);
        }

        return statement;
    });


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
