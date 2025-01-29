import type ts from 'typescript';
import { Application } from '../../application/Application';
import { createApplicationMetadata } from '../../../runtime-metadata/v2/createApplicationMetadata';
import { Context } from '../../../compilation-context/Context';

export const transformApplicationClassV2 = (
  node: ts.ClassDeclaration,
  application: Application,
): ts.ClassDeclaration => {
  const staticBlock = createApplicationMetadata(application);

  return Context.ts.factory.updateClassDeclaration(
    node,
    node.modifiers,
    node.name,
    node.typeParameters,
    node.heritageClauses,
    [
      staticBlock,
      ...node.members,
    ]
  );
};
