import ts, { factory } from 'typescript';
import { Configuration } from '../../configuration/Configuration';
import { Application } from '../../application/Application';
import { valueToASTExpression } from '../../ts/utils/valueToASTExpression';
import { addDoNotEditCommentToStaticInitBlock } from './addDoNotEditCommentToStaticInitBlock';
import { InternalElementKind, InternalsAccessBuilder } from '../../internals-access/InternalsAccessBuilder';
import { filterLibraryModifiers } from '../../ts/utils/filterLibraryModifiers';
import { BeanNode } from '../../bean/Bean';
import { BeanKind } from '../../bean/BeanKind';
import { RuntimeMetadataBuilder } from './RuntimeMetadataBuilder';

export const transformConfigurationOrApplicationClass = (node: ts.ClassDeclaration, configuration: Configuration, application: Application | null): ts.ClassDeclaration => {
  const runtimeMetadata = RuntimeMetadataBuilder.metadata(configuration, application);
  const metadataDefinitionMethod = application !== null ? 'defineApplicationMetadata' : 'defineConfigurationMetadata';
  const metadataStaticInitBlock = addDoNotEditCommentToStaticInitBlock(factory.createClassStaticBlockDeclaration(factory.createBlock(
    [
      factory.createExpressionStatement(factory.createCallExpression(
        factory.createPropertyAccessExpression(
          InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.ClawjectInternalRuntimeUtils),
          factory.createIdentifier(metadataDefinitionMethod)
        ),
        undefined,
        [
          ts.factory.createThis(),
          valueToASTExpression(runtimeMetadata)
        ]
      ))
    ],
    true
  )));

  const updatedMembers = node.members.map(node => {
    const bean = configuration.beanRegister.getByNode(node as BeanNode);

    if (bean === null) {
      return node;
    }

    switch (bean.kind) {
    case BeanKind.FACTORY_METHOD:
    case BeanKind.LIFECYCLE_METHOD: {
      const typedNode = bean.node as ts.MethodDeclaration;

      return ts.factory.updateMethodDeclaration(
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
        return ts.factory.updateGetAccessorDeclaration(
          typedNode,
          filterLibraryModifiers(typedNode.modifiers),
          typedNode.name,
          typedNode.parameters,
          typedNode.type,
          typedNode.body,
        );
      }

      return ts.factory.updatePropertyDeclaration(
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
