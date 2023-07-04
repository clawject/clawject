import ts from 'typescript';
import { Bean } from './Bean';
import { createBoolean } from '../ts/utils/createBoolean';
import { ConfigLoader } from '../../config/ConfigLoader';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';

export const getBeanLazyExpressionValue = (bean: Bean): ts.Expression => {
    const decoratorMetadata = extractDecoratorMetadata(bean.node, DecoratorKind.Lazy);

    if (decoratorMetadata === null) {
        return createBoolean(ConfigLoader.get().features.lazyBeans);
    }

    if (decoratorMetadata.args.length === 0) {
        return ts.factory.createTrue();
    }

    return decoratorMetadata.args[0];
};
