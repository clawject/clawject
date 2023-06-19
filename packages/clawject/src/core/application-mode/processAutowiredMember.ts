import ts from 'typescript';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { DITypeBuilder } from '../type-system/DITypeBuilder';

//Autowired members can be declared in Configuration or Component classes.
export const processAutowiredMember = (
    compilationContext: CompilationContext,
    classElement: ts.ClassElement
): void => {
    const typeChecker = compilationContext.typeChecker;
    const type = typeChecker.getTypeAtLocation(classElement);
    const diType = DITypeBuilder.build(type);
};
