import ts from 'typescript';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { processAutowiredMember } from './processAutowiredMember';
import { getDecoratorsOnly } from '../ts/utils/getDecoratorsOnly';

export const processClassMembers = (
    compilationContext: CompilationContext,
    classDeclaration: ts.ClassDeclaration
) => {
    const classMembers = classDeclaration.members;

    classMembers.forEach(classMember => {
        const decorators = getDecoratorsOnly(classMember);

        processAutowiredMember(compilationContext, classMember);
    });
};
