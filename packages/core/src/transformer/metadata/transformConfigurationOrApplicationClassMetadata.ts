import type ts from 'typescript';
import { Value } from '../../core/utils/Value';
import { Context } from '../../compilation-context/Context';

//TODO maybe in future decorators can be applicable to class members in d.ts files, but now it's only applicable to class declarations
export const transformConfigurationOrApplicationClassMetadata = (
  node: ts.ClassDeclaration,
  shouldAddClawjectImport: Value<boolean>,
  clawjectIdentifier: ts.Identifier
): ts.ClassDeclaration => {
  return node;
  // if (!node.original) {
  //   Logger.error('"node.original" is missing during metadata transformation.');
  //   return node;
  // }
  //
  // const originalNode = node.original as ts.ClassDeclaration;
  //
  // const configuration = ConfigurationRepository.nodeToConfiguration.get(originalNode);
  // const application = ApplicationRepository.nodeToApplication.get(originalNode);
  //
  // if (!configuration) {
  //   return node;
  // }
  //
  // if (!configuration && !application) {
  //   return node;
  // }
  //
  // shouldAddClawjectImport.value = true;
  //
  // const ClassKindDecorator = buildDecorator(
  //   clawjectIdentifier,
  //   application ? 'Application' : 'Configuration',
  //   undefined,
  // );
  // const ClassExternalDecorator = buildDecorator(
  //   clawjectIdentifier,
  //   getInternalOrExternalIdentifier(configuration.external),
  //   undefined,
  // );
  // const beansMetadata: CompileTimeMetadataBean[] =[];
  // configuration.beanRegister.elements.forEach(bean => {
  //   beansMetadata.push({
  //     k: bean.kind,
  //     n: bean.classMemberName,
  //     p: bean.primary,
  //     e: bean.external,
  //     q: bean.qualifier,
  //     nP: bean.nestedProperty,
  //   });
  // });
  // const importsMetadata: CompileTimeMetadataImport[] = [];
  // configuration.importRegister.elements.forEach(importedConfiguration => {
  //   importsMetadata.push({
  //     n: importedConfiguration.classMemberName,
  //     e: importedConfiguration.external,
  //   });
  // });
  // const ClassBeansDecorator = buildDecorator(
  //   clawjectIdentifier,
  //   beansMetadata.length ? 'Beans' : null,
  //   [valueToASTExpression(beansMetadata, false)]
  // );
  // const ClassImportsDecorator = buildDecorator(
  //   clawjectIdentifier,
  //   importsMetadata.length ? 'Imports' : null,
  //   [valueToASTExpression(importsMetadata, false)]
  // );
  //
  // return Context.factory.updateClassDeclaration(
  //   node,
  //   compact([
  //     ClassKindDecorator,
  //     ClassExternalDecorator,
  //     ClassBeansDecorator,
  //     ClassImportsDecorator,
  //     ...(node.modifiers ?? []),
  //   ]),
  //   node.name,
  //   node.typeParameters,
  //   node.heritageClauses,
  //   node.members,
  // );
};

function buildDecorator(clawjectIdentifier: ts.Identifier, identifier: string | null, args: ts.Expression[] | undefined): ts.Decorator | null {
  if (!identifier) {
    return null;
  }

  let decoratorAccessExpression: ts.Expression = Context.factory.createPropertyAccessExpression(
    Context.factory.createPropertyAccessExpression(
      clawjectIdentifier,
      'CompileTimeMetadata'
    ),
    identifier
  );

  if (args) {
    decoratorAccessExpression = Context.factory.createCallExpression(
      decoratorAccessExpression,
      undefined,
      args
    );
  }

  return Context.factory.createDecorator(decoratorAccessExpression);
}

function getInternalOrExternalIdentifier(value: boolean | null): 'External' | 'Internal' | null {
  if (value) {
    return 'External';
  }

  if (value === null) {
    return null;
  }

  return 'Internal';
}
