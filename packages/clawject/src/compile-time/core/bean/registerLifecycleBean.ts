import ts from 'typescript';
import { MissingInitializerError } from '../../compilation-context/messages/errors/MissingInitializerError';
import { ClassPropertyWithArrowFunctionInitializer } from '../ts/types';
import { Bean } from './Bean';
import { BeanKind } from './BeanKind';
import { Configuration } from '../configuration/Configuration';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { LifecycleKind } from '../../../runtime/types/LifecycleKind';
import { extractDecoratorMetadata } from '../decorator-processor/extractDecoratorMetadata';
import { DecoratorKind } from '../decorator-processor/DecoratorKind';
import { CType } from '../type-system/CType';

export const registerLifecycleBean = (
  configuration: Configuration,
  classElement: ts.MethodDeclaration | ClassPropertyWithArrowFunctionInitializer,
): void => {
  const compilationContext = getCompilationContext();
  if (ts.isMethodDeclaration(classElement) && !classElement.body) {
    compilationContext.report(new MissingInitializerError(
      'Lifecycle method should have a body.',
      classElement.name,
      configuration,
      null,
    ));
    return;
  }

  const lifecycles = new Set<LifecycleKind>();
  const postConstructMetadata = extractDecoratorMetadata(classElement, DecoratorKind.PostConstruct);
  const preDestroyMetadata = extractDecoratorMetadata(classElement, DecoratorKind.PreDestroy);

  if (postConstructMetadata !== null) {
    lifecycles.add(LifecycleKind.POST_CONSTRUCT);
  }
  if (preDestroyMetadata !== null) {
    lifecycles.add(LifecycleKind.PRE_DESTROY);
  }

  if (lifecycles.size === 0) {
    return;
  }

  const bean = new Bean({
    classMemberName: classElement.name.getText(),
    node: classElement,
    kind: ts.isMethodDeclaration(classElement) ? BeanKind.LIFECYCLE_METHOD : BeanKind.LIFECYCLE_ARROW_FUNCTION,
    lifecycle: Array.from(lifecycles),
  });

  bean.registerType(new CType(getCompilationContext().typeChecker.getAnyType()));
  configuration.beanRegister.register(bean);
};
