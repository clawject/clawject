import ts from 'typescript';
import { isDecoratorFromLibrary } from './isDecoratorFromLibrary';
import { getDecoratorsOnly } from '../utils/getDecoratorsOnly';

export const isMethodBean = (node: ts.Node): node is ts.MethodDeclaration =>
    ts.isMethodDeclaration(node) && Boolean(getDecoratorsOnly(node).some(it => isDecoratorFromLibrary(it, 'Bean')));
