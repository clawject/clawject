import ts from 'typescript';
import { isDecoratorFromLibrary } from './isDecoratorFromLibrary';
import { getDecoratorsOnly } from '../utils/getDecoratorsOnly';

export const isLifecycleMethodBean = (node: ts.Node): node is ts.MethodDeclaration =>
    ts.isMethodDeclaration(node) &&
    getDecoratorsOnly(node).some(it => {
        return isDecoratorFromLibrary(it, 'PostConstruct') || isDecoratorFromLibrary(it, 'BeforeDestruct');
    });
