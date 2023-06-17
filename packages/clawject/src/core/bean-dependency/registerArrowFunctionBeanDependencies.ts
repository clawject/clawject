import { ClassPropertyWithArrowFunctionInitializer } from '../ts/types';
import { CompilationContext } from '../../compilation-context/CompilationContext';
import { registerBeanDependenciesFromParameters } from './registerBeanDependenciesFromParameters';
import { ContextBean } from '../bean/ContextBean';
import { unwrapExpressionFromRoundBrackets } from '../ts/utils/unwrapExpressionFromRoundBrackets';

export const registerArrowFunctionBeanDependencies = (
    compilationContext: CompilationContext,
    bean: ContextBean<ClassPropertyWithArrowFunctionInitializer>
) => {
    registerBeanDependenciesFromParameters(bean, unwrapExpressionFromRoundBrackets(bean.node.initializer).parameters, compilationContext);
};


