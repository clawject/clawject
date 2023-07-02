import ts from 'typescript';
import { Bean } from '../../bean/Bean';
import { getDecoratorsOnly } from '../utils/getDecoratorsOnly';
import { isDecoratorFromLibrary } from '../predicates/isDecoratorFromLibrary';
import { getCompilationContext } from '../../../../transformer/getCompilationContext';
import { IncorrectArgumentsLengthError } from '../../../compilation-context/messages/errors/IncorrectArgumentsLengthError';
import { createBoolean } from '../utils/createBoolean';
import { ConfigLoader } from '../../../config/ConfigLoader';

export const getBeanLazyExpression = (bean: Bean): ts.Expression => {
    const compilationContext = getCompilationContext();
    const lazyDecorator = getDecoratorsOnly(bean.node)
        .find(it => isDecoratorFromLibrary(it, 'Lazy'));

    if (lazyDecorator === undefined) {
        return createBoolean(ConfigLoader.get().features.lazyBeans);
    }

    if (!ts.isCallExpression(lazyDecorator.expression)) {
        //If not called - using default value (true)
        return ts.factory.createTrue();
    }

    if (lazyDecorator.expression.arguments.length === 0) {
        return ts.factory.createTrue();
    }

    if (lazyDecorator.expression.arguments.length > 1) {
        compilationContext.report(new IncorrectArgumentsLengthError(
            '@Lazy decorator can accepts only one argument.',
            lazyDecorator,
            bean.parentConfiguration.node,
        ));
        return ts.factory.createTrue();
    }

    return lazyDecorator.expression.arguments[0];
};
