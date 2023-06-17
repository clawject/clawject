import ts from 'typescript';
import { getNodeSourceDescriptor } from '../utils/getNodeSourceDescriptor';
import { CompilationContext } from '../../../compilation-context/CompilationContext';

export const isExtendsClassFromLibrary = (node: ts.Node, className: 'CatContext', compilationContext: CompilationContext): node is ts.ClassDeclaration => {
    if (!ts.isClassDeclaration(node)) {
        return false;
    }

    const extendsHeritageClause = node.heritageClauses?.find(clause => clause.token === ts.SyntaxKind.ExtendsKeyword);

    if (!extendsHeritageClause) {
        return false;
    }

    const nodeSourceDescriptors = getNodeSourceDescriptor(extendsHeritageClause.types[0].expression, compilationContext);

    if (!nodeSourceDescriptors) {
        return false;
    }

    return nodeSourceDescriptors.every(it => it.isLibraryNode && it.originalName === className);
};
