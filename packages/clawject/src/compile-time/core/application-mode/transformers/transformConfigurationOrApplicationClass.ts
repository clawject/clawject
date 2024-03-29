import ts from 'typescript';
import { Configuration } from '../../configuration/Configuration';
import { Application } from '../../application/Application';
import { valueToASTExpression } from '../../ts/utils/valueToASTExpression';
import { addDoNotEditComment, DoNotEditElement } from './addDoNotEditComment';
import { InternalElementKind, InternalsAccessBuilder } from '../../internals-access/InternalsAccessBuilder';
import { filterLibraryModifiers } from '../../ts/utils/filterLibraryModifiers';
import { BeanNode } from '../../bean/Bean';
import { BeanKind } from '../../bean/BeanKind';
import { RuntimeMetadataBuilder } from './RuntimeMetadataBuilder';
import { getCompilationContext } from '../../../../transformer/getCompilationContext';
import { compact } from 'lodash';

export const transformConfigurationOrApplicationClass = (node: ts.ClassDeclaration, configuration: Configuration, application: Application | null): ts.ClassDeclaration | ts.ClassLikeDeclaration => {
  const factory = getCompilationContext().factory;
  const runtimeMetadata = RuntimeMetadataBuilder.metadata(configuration, application);
  const metadataDefinitionMethod = application !== null ? 'defineApplicationMetadata' : 'defineConfigurationMetadata';
  const staticInitBlock = factory.createClassStaticBlockDeclaration(factory.createBlock(
    [
      factory.createExpressionStatement(factory.createCallExpression(
        factory.createPropertyAccessExpression(
          InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.ClawjectInternalRuntimeUtils),
          factory.createIdentifier(metadataDefinitionMethod)
        ),
        undefined,
        compact([
          node.name,
          valueToASTExpression(runtimeMetadata)
        ]),
      ))
    ],
    true
  ));
  const metadataStaticInitBlock = addDoNotEditComment(staticInitBlock, DoNotEditElement.STATIC_INIT_BLOCK);

  const updatedMembers = node.members.map(node => {
    const bean = configuration.beanRegister.getByNode(node as BeanNode);

    if (bean === null) {
      return node;
    }

    switch (bean.kind) {
    case BeanKind.FACTORY_METHOD:
    case BeanKind.LIFECYCLE_METHOD: {
      const typedNode = bean.node as ts.MethodDeclaration;

      return factory.updateMethodDeclaration(
        typedNode,
        filterLibraryModifiers(typedNode.modifiers),
        undefined,
        typedNode.name,
        undefined,
        undefined,
        typedNode.parameters,
        typedNode.type,
        typedNode.body,
      );
    }

    case BeanKind.CLASS_CONSTRUCTOR:
    case BeanKind.FACTORY_ARROW_FUNCTION:
    case BeanKind.LIFECYCLE_ARROW_FUNCTION:
    case BeanKind.VALUE_EXPRESSION: {
      const typedNode = bean.node as ts.PropertyDeclaration | ts.GetAccessorDeclaration;

      if (ts.isGetAccessorDeclaration(typedNode)) {
        return factory.updateGetAccessorDeclaration(
          typedNode,
          filterLibraryModifiers(typedNode.modifiers),
          typedNode.name,
          typedNode.parameters,
          typedNode.type,
          typedNode.body,
        );
      }

      return factory.updatePropertyDeclaration(
        typedNode,
        filterLibraryModifiers(typedNode.modifiers),
        typedNode.name,
        typedNode.questionToken,
        typedNode.type,
        typedNode.initializer,
      );
    }

    default:
      return node;
    }
  });

  return ts.factory.updateClassDeclaration(
    node,
    filterLibraryModifiers(node.modifiers),
    node.name,
    node.typeParameters,
    node.heritageClauses,
    [
      ...updatedMembers,
      metadataStaticInitBlock
    ]
  );
};
