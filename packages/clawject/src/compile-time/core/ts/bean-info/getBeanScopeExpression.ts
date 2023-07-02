import ts from 'typescript';
import { Bean } from '../../bean/Bean';
import { getDecoratorsOnly } from '../utils/getDecoratorsOnly';
import { isDecoratorFromLibrary } from '../predicates/isDecoratorFromLibrary';
import { getCompilationContext } from '../../../../transformer/getCompilationContext';
import { IncorrectArgumentsLengthError } from '../../../compilation-context/messages/errors/IncorrectArgumentsLengthError';

export const getBeanScopeExpression = (bean: Bean): ts.Expression => {
    const compilationContext = getCompilationContext();
    const scopeDecorator = getDecoratorsOnly(bean.node)
        .find(it => isDecoratorFromLibrary(it, 'Scope'));

    if (scopeDecorator === undefined) {
        return ts.factory.createStringLiteral('singleton');
    }

    if (!ts.isCallExpression(scopeDecorator.expression) || scopeDecorator.expression.arguments.length === 0) {
        compilationContext.report(new IncorrectArgumentsLengthError(
            'You should provide scope value to the @Scope decorator.',
            scopeDecorator,
            bean.parentConfiguration.node,
        ));
        return ts.factory.createStringLiteral('singleton');
    }

    if (scopeDecorator.expression.arguments.length > 1) {
        compilationContext.report(new IncorrectArgumentsLengthError(
            '@Scope decorator can accepts only 1 argument.',
            scopeDecorator,
            bean.parentConfiguration.node,
        ));
        return ts.factory.createStringLiteral('singleton');
    }

    return scopeDecorator.expression.arguments[0];
};
