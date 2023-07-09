import { ClassPropertyWithArrowFunctionInitializer } from '../ts/types';
import { registerBeanDependenciesFromParameters } from './registerBeanDependenciesFromParameters';
import { Bean } from '../bean/Bean';
import { unwrapExpressionFromRoundBrackets } from '../ts/utils/unwrapExpressionFromRoundBrackets';

export const registerArrowFunctionBeanDependencies = (bean: Bean<ClassPropertyWithArrowFunctionInitializer>) => {
  registerBeanDependenciesFromParameters(bean, unwrapExpressionFromRoundBrackets(bean.node.initializer).parameters);
};


