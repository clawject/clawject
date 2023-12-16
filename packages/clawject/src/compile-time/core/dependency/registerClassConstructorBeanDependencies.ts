import ts from 'typescript';
import { ClassPropertyWithCallExpressionInitializer } from '../ts/types';
import { Bean } from '../bean/Bean';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { unwrapExpressionFromRoundBrackets } from '../ts/utils/unwrapExpressionFromRoundBrackets';
import { DependencyResolvingError } from '../../compilation-context/messages/errors/DependencyResolvingError';
import { Configuration } from '../configuration/Configuration';
import { Dependency } from './Dependency';
import { DITypeBuilder } from '../type-system/DITypeBuilder';

export const registerClassConstructorBeanDependencies = (bean: Bean<ClassPropertyWithCallExpressionInitializer>, configuration: Configuration) => {
  const classElement = bean.node;

  const compilationContext = getCompilationContext();
  const typeChecker = compilationContext.typeChecker;
  const firstArgument: ts.Expression = unwrapExpressionFromRoundBrackets(classElement.initializer).arguments[0];

  if (!firstArgument) {
    //DO not report error, because assuming it's reported on Bean registration stage (registerBeanClassConstructor.ts)
    return;
  }

  const firstArgumentType = typeChecker.getTypeAtLocation(firstArgument);
  const firstArgumentConstructorSignatures = firstArgumentType.getConstructSignatures();

  if (firstArgumentConstructorSignatures.length !== 1) {
    compilationContext.report(new DependencyResolvingError(
      'Try to use bean factory-method instead.',
      firstArgument,
      configuration,
    ));
    return;
  }
  const firstArgumentConstructorSignature = firstArgumentConstructorSignatures[0];

  firstArgumentConstructorSignature.parameters.forEach(parameter => {
    const typeOfParameter = typeChecker.getTypeOfSymbol(parameter);

    const diType = DITypeBuilder.build(typeOfParameter);

    const dependency = new Dependency();
    dependency.parameterName = parameter.name;
    dependency.diType = diType;
    if (!parameter.valueDeclaration) {
      compilationContext.report(new DependencyResolvingError(
        'Try to use bean factory-method instead.',
        firstArgument,
        configuration,
      ));
      return;
    }

    dependency.node = parameter.valueDeclaration as ts.ParameterDeclaration;

    bean.registerDependency(dependency);
    //Do not register parameter node, because it's useless for Class constructor Dependencies
  });
};
