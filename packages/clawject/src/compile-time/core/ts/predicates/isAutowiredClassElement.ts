import ts from 'typescript';
import { extractDecoratorMetadata } from '../../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../../decorator-processor/DecoratorKind';

export const isAutowiredClassElement = (classElement: ts.ClassElement): classElement is ts.PropertyDeclaration => {
    if (!ts.isPropertyDeclaration(classElement)) {
        return false;
    }

    return extractDecoratorMetadata(classElement, DecoratorKind.Autowired) !== null;
};
