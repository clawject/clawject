import ts from 'typescript';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { processAutowiredMember } from './processAutowiredMember';
import { getDecoratorsOnly } from '../ts/utils/getDecoratorsOnly';
import { isDecoratorFromLibrary } from '../ts/predicates/isDecoratorFromLibrary';

export const processClassMembers = (
    compilationContext: CompilationContext,
    classDeclaration: ts.ClassDeclaration
) => {
    const classElements = classDeclaration.members;

    classElements.forEach(classMember => {
        const decorators = getDecoratorsOnly(classMember);

        if (decorators.some(it => isDecoratorFromLibrary(it, 'Autowired'))) {
            processAutowiredMember(compilationContext, classMember);
        }
    });
};
