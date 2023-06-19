import ts from 'typescript';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { DIType } from './DIType';
import { CONSTANTS } from '../../constants';
import { DITypeBuilder } from './DITypeBuilder';

class BaseTypes {
    declare array: DIType;
    declare set: DIType;
    declare map: DIType;
    declare mapStringToAny: DIType;
}

export class BaseTypesRepository {
    private static baseTypes: BaseTypes | null = null;

    static init(compilationContext: CompilationContext): void {
        if (this.baseTypes !== null) {
            return;
        }

        const libraryDeclarationFile = compilationContext.program.getSourceFile(CONSTANTS.packageRoot);

        if (!libraryDeclarationFile) {
            throw new Error(`${CONSTANTS.libraryName} library declaration file (index.d.ts) not found`);
        }

        const typeTableDeclaration = libraryDeclarationFile.statements
            .find((it): it is ts.InterfaceDeclaration => ts.isInterfaceDeclaration(it) && it.name.getText() === '_TypeTable');

        if (!typeTableDeclaration) {
            throw new Error(`${CONSTANTS.libraryName} type table declaration not found`);
        }

        const typesMap = typeTableDeclaration.members
            .reduce((acc, curr) => {
                acc[curr.name?.getText() ?? ''] = curr;

                return acc;
            }, {} as Record<string, ts.TypeElement>);

        this.baseTypes = new BaseTypes();

        this.baseTypes.array = DITypeBuilder.build(compilationContext.typeChecker.getTypeAtLocation(typesMap['array']));
        this.baseTypes.set = DITypeBuilder.build(compilationContext.typeChecker.getTypeAtLocation(typesMap['set']));
        this.baseTypes.map = DITypeBuilder.build(compilationContext.typeChecker.getTypeAtLocation(typesMap['map']));
        this.baseTypes.mapStringToAny = DITypeBuilder.build(compilationContext.typeChecker.getTypeAtLocation(typesMap['mapStringToAny']));
    }

    static getBaseTypes(): BaseTypes {
        if (this.baseTypes === null) {
            throw new Error('Base types are not initialized');
        }

        return this.baseTypes;
    }
}
