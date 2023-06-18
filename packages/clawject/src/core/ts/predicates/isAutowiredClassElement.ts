import ts from 'typescript';
import { ClassPropertyWithCallExpressionInitializer, ClassPropertyWithoutInitializer } from '../types';
import { getDecoratorsOnly } from '../utils/getDecoratorsOnly';

export const isAutowiredClassElement = (classElement: ts.ClassElement): classElement is ClassPropertyWithCallExpressionInitializer | ClassPropertyWithoutInitializer => {
    const decorators = getDecoratorsOnly(classElement);

    return true;
};
