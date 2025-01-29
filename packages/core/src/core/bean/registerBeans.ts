import { Configuration } from '../configuration/Configuration';
import { Context } from '../../compilation-context/Context';
import { ClassDefinitionsAccessor } from '../ClassDefinitionsAccessor';
import { readBeanDefinitionMetadata } from '../metadata/v2/bean/readBeanDefinitionMetadata';
import { BeanKind } from './BeanKind';
import { registerBean } from './registerBean';
import { readLifecycleDefinitionMetadata } from '../metadata/v2/lifecycle/readLifecycleDefinitionMetadata';

export function registerBeans(configuration: Configuration): void {
  const classDefinitions = ClassDefinitionsAccessor.getDefinition(
    configuration.node
  );

  classDefinitions.beans.forEach((classElement) => {
    const classElementDeclaration = classElement.getDeclarations() ?? [];
    if (classElementDeclaration.length !== 1) {
      //TODO report error BEAN SHOULD HAVE ONLY ONE PROPERTY DECLARATION
      return;
    }
    const propertyDeclaration = classElementDeclaration[0];
    if (!Context.ts.isPropertyDeclaration(propertyDeclaration) && !Context.ts.isGetAccessor(propertyDeclaration)) {
      //TODO report error SHOULD BE PROPERTY DECLARATION
      return;
    }

    const beanDefinition = readBeanDefinitionMetadata(classElement);
    if (beanDefinition === null) {
      //TODO: report metadata error?
      return;
    }

    const valueType = beanDefinition.awaitedValueType;

    const constructSignatures = valueType.getConstructSignatures();
    const callSignatures = valueType.getCallSignatures();

    if (constructSignatures.length !== 0 && callSignatures.length !== 0) {
      //TODO report error
      return;
    }

    if (constructSignatures.length) {
      if (constructSignatures.length > 1) {
        //TODO report error
        return;
      }

      registerBean(
        configuration,
        beanDefinition,
        BeanKind.V2_CLASS,
        constructSignatures[0],
        propertyDeclaration
      );
    } else if (callSignatures.length) {
      if (callSignatures.length > 1) {
        //TODO report error
        return;
      }

      registerBean(
        configuration,
        beanDefinition,
        BeanKind.V2_FACTORY,
        callSignatures[0],
        propertyDeclaration
      );
    } else {
      registerBean(
        configuration,
        beanDefinition,
        BeanKind.V2_VALUE,
        null,
        propertyDeclaration
      );
    }
  });

  classDefinitions.lifecycle.forEach((classElement) => {
    const classElementDeclaration = classElement.getDeclarations() ?? [];
    if (classElementDeclaration.length !== 1) {
      //TODO report error BEAN SHOULD HAVE ONLY ONE PROPERTY DECLARATION
      return;
    }
    const propertyDeclaration = classElementDeclaration[0];
    if (!Context.ts.isPropertyDeclaration(propertyDeclaration) && !Context.ts.isGetAccessor(propertyDeclaration)) {
      //TODO report error SHOULD BE PROPERTY DECLARATION
      return;
    }

    const lifecycleDefinition = readLifecycleDefinitionMetadata(classElement);
    if (lifecycleDefinition === null) {
      //TODO: report metadata error?
      return;
    }

    const callbackType = lifecycleDefinition.callbackType;

    const callSignatures = callbackType.getCallSignatures();

    if (callSignatures.length !== 1) {
      //TODO report error
      return;
    }

    registerBean(
      configuration,
      {
        primary: null,
        internal: null,
        embedded: null,
        names: [],
        rawValueType: lifecycleDefinition.callbackType,
        awaitedValueType: lifecycleDefinition.callbackType,
        type: lifecycleDefinition.callbackType,
      },
      BeanKind.V2_LIFECYCLE,
      callSignatures[0],
      propertyDeclaration
    );
  });
}
