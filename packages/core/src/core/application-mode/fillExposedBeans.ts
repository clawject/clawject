import type ts from 'typescript';
import { Application } from '../application/Application';
import { isExposeBeansClassProperty } from '../ts/predicates/isExposeBeansClassProperty';
import { TypeQualifyError } from '../../compilation-context/messages/errors/TypeQualifyError';
import { Dependency } from '../dependency/Dependency';
import { DependencyResolver } from '../dependency-resolver/DependencyResolver';
import { CType } from '../type-system/CType';
import { BeanExposingError } from '../../compilation-context/messages/errors/BeanExposingError';
import { ClassPropertyWithExpressionInitializer } from '../ts/types';
import { Context } from '../../compilation-context/Context';

class ExposedBean {
  constructor(
    public readonly dependency: Dependency,
    public readonly symbol: ts.Symbol,
    public readonly exposeDeclaration: ClassPropertyWithExpressionInitializer,
  ) {}
}

export const fillExposedBeans = (application: Application): void => {
  const exposedBeans = new Map<string, ExposedBean>();

  application.rootConfiguration.node.members.forEach(member => {
    if (isExposeBeansClassProperty(member)) {
      fillExposedBeansForClassElementNode(application, member, exposedBeans);
    }
  });

  fillApplicationExposedBeans(application, exposedBeans);
};

function fillExposedBeansForClassElementNode(application: Application, member: ClassPropertyWithExpressionInitializer, exposedBeans: Map<string, ExposedBean>): void {
  const typeChecker = Context.typeChecker;
  const nodeType = typeChecker.getTypeAtLocation(member);
  const callSignatures = nodeType.getCallSignatures();

  if (callSignatures.length !== 1) {
    Context.report(new TypeQualifyError(
      `Could not resolve exposed beans signature. Exposed beans property must have exactly one 1 signature, found ${callSignatures.length} signatures.`,
      member,
      null,
      application,
    ));
    return;
  }

  const callSignature = callSignatures[0];

  const returnType = typeChecker.getReturnTypeOfSignature(callSignature);
  const properties = returnType.getProperties();

  const beansProperty = properties.find(it => it.getName() === 'beans');

  if (!beansProperty) {
    Context.report(new TypeQualifyError(
      'Could not resolve export beans type.',
      member,
      null,
      application,
    ));
    return;
  }

  const beansType = typeChecker.getTypeOfSymbol(beansProperty);
  const duplicatedExposedProperties: ts.Symbol[] = [];

  beansType.getProperties().forEach(property => {
    const propertyName = property.getName();
    const propertyDeclaration = property.valueDeclaration;
    const alreadyExposedBean = exposedBeans.get(propertyName);

    if (!propertyDeclaration) {
      Context.report(new TypeQualifyError(
        'Could not resolve export beans type.',
        member,
        null,
        application,
      ));
      return;
    }

    if (alreadyExposedBean) {
      const duplicatedExposedPropertySymbol = alreadyExposedBean.dependency.getNodeSafe()?.symbol;

      if (duplicatedExposedPropertySymbol) {
        duplicatedExposedProperties.push(duplicatedExposedPropertySymbol);
      }

      duplicatedExposedProperties.push(property);
      return;
    }

    const symbolType = typeChecker.getTypeOfSymbol(property);
    const symbolCType = new CType(symbolType);

    const dependency = new Dependency();
    dependency.node = propertyDeclaration as ts.PropertyDeclaration;
    dependency.parameterName = propertyName;
    dependency.cType = symbolCType;

    const exposedBean = new ExposedBean(dependency, property, member);
    exposedBeans.set(propertyName, exposedBean);
  });

  if (duplicatedExposedProperties.length !== 0) {
    Context.report(new BeanExposingError(
      'Duplicate declaration of exposed beans property detected.',
      member,
      duplicatedExposedProperties,
      application,
    ));
  }
}

function fillApplicationExposedBeans(application: Application, exposedBeans: Map<string, ExposedBean>): void {
  const externalBeans = application.beansArray.filter(it => it.isExternal() && !it.isLifecycle());
  const notResolvedExposings = new Map<ClassPropertyWithExpressionInitializer, ExposedBean[]>();

  exposedBeans.forEach((dependency, propertyName) => {
    // const resolvedDependency = DependencyResolver.resolveDependencies(dependency.dependency, externalBeans, null, application);
    //
    // application.exposedBeans.set(propertyName, resolvedDependency);
    //
    // if (!resolvedDependency.isResolved()) {
    //   const notResolved = notResolvedExposings.get(dependency.exposeDeclaration) ?? [];
    //   notResolved.push(dependency);
    //
    //   if (!notResolvedExposings.has(dependency.exposeDeclaration)) {
    //     notResolvedExposings.set(dependency.exposeDeclaration, notResolved);
    //   }
    // }
  });

  notResolvedExposings.forEach((notExposedElements, exposeDeclaration) => {
    if (notExposedElements.length === 0) {
      return;
    }

    Context.report(new BeanExposingError(
      `Could not find suitable bean candidates for ${notExposedElements.length} elements.`,
      exposeDeclaration.initializer,
      notExposedElements.map(it => it.dependency.node.symbol),
      application,
    ));
  });
}
