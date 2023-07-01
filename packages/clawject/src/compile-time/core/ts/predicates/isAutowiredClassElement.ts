import ts from 'typescript';
import { getDecoratorsOnly } from '../utils/getDecoratorsOnly';
import { isDecoratorFromLibrary } from './isDecoratorFromLibrary';
import { unwrapExpressionFromRoundBrackets } from '../utils/unwrapExpressionFromRoundBrackets';
import { getNodeSourceDescriptor } from '../utils/getNodeSourceDescriptor';

export const isAutowiredClassElement = (classElement: ts.ClassElement): classElement is ts.PropertyDeclaration => {
    if (!ts.isPropertyDeclaration(classElement)) {
        return false;
    }

    const hasAutowiredDecorator = getDecoratorsOnly(classElement).some(it => isDecoratorFromLibrary(it, 'Autowired'));
    const hasAutowiredCallExpression = getHasAutowiredCallExpression(classElement);

    return hasAutowiredDecorator || hasAutowiredCallExpression;
};

function getHasAutowiredCallExpression(classElement: ts.PropertyDeclaration): boolean {
    let initializer = classElement.initializer;

    if (initializer === undefined) {
        return false;
    }

    initializer = unwrapExpressionFromRoundBrackets(initializer);

    if (!ts.isCallExpression(initializer)) {
        return false;
    }

    const nodeSourceDescriptors = getNodeSourceDescriptor(initializer.expression);

    if (nodeSourceDescriptors === null) {
        return false;
    }

    return nodeSourceDescriptors.every(it => it.isLibraryNode && it.originalName === 'Autowired');
}
