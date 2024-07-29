import type * as ts from 'typescript';
import { Configuration } from '../../configuration/Configuration';
import { Application } from '../../application/Application';
import { valueToASTExpression } from '../../ts/utils/valueToASTExpression';
import { addDoNotEditComment, DoNotEditElement } from './addDoNotEditComment';
import { InternalElementKind, InternalsAccessBuilder } from '../../internals-access/InternalsAccessBuilder';
import { filterLibraryModifiers } from '../../ts/utils/filterLibraryModifiers';
import { BeanNode } from '../../bean/Bean';
import { BeanKind } from '../../bean/BeanKind';
import { RuntimeMetadataBuilder } from './RuntimeMetadataBuilder';
import { compact } from 'lodash';
import { Context } from '../../../compilation-context/Context';
import { ApplicationRepository } from '../../application/ApplicationRepository';
import { Compiler } from '../../compiler/Compiler';
import { ConfigLoader } from '../../../config/ConfigLoader';

export const transformConfigurationOrApplicationClass = (node: ts.ClassDeclaration, configuration: Configuration, application: Application | null): ts.ClassDeclaration | ts.ClassLikeDeclaration => {
  const factory = Context.factory;
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

  const developmentMetadataStaticInitBlocks: ts.ClassStaticBlockDeclaration[] = [];

  if (ConfigLoader.get().mode === 'development') {
    ApplicationRepository.applicationIdToApplication.forEach(application => {
      if (!application.resolvedImports.has(configuration) && application.rootConfiguration !== configuration) {
        return;
      }

      const applicationMetadata = RuntimeMetadataBuilder.metadata(application.rootConfiguration, application);
      const staticInitBlock = factory.createClassStaticBlockDeclaration(factory.createBlock(
        [
          factory.createExpressionStatement(factory.createCallExpression(
            factory.createPropertyAccessExpression(
              InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.ClawjectInternalRuntimeUtils),
              factory.createIdentifier('defineDevelopmentApplicationMetadata')
            ),
            undefined,
            compact([
              valueToASTExpression(application.id),
              valueToASTExpression(Compiler.projectVersion),
              valueToASTExpression(applicationMetadata)
            ]),
          ))
        ],
        true
      ));

      developmentMetadataStaticInitBlocks.push(staticInitBlock);
    });
  }

  const updatedMembers = node.members.map(node => {
    const bean = configuration.beanRegister.getByNode(node as BeanNode);
    const imp = configuration.importRegister.getByNode(node as ts.PropertyDeclaration);

    if (bean !== null) {
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

        if (Context.ts.isGetAccessorDeclaration(typedNode)) {
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
    }

    if (imp !== null) {
      const typedNode = node as ts.PropertyDeclaration;

      return factory.updatePropertyDeclaration(
        typedNode,
        filterLibraryModifiers(typedNode.modifiers),
        typedNode.name,
        typedNode.questionToken,
        typedNode.type,
        typedNode.initializer,
      );
    }

    return node;
  });

  return Context.ts.factory.updateClassDeclaration(
    node,
    filterLibraryModifiers(node.modifiers),
    node.name,
    node.typeParameters,
    node.heritageClauses,
    [
      ...updatedMembers,
      metadataStaticInitBlock,
      ...developmentMetadataStaticInitBlocks,
    ]
  );
};
