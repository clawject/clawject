import type * as ts from 'typescript';
import { getNodeSourceDescriptor } from '../ts/utils/getNodeSourceDescriptor';
import { DecoratorKind, DecoratorKinds } from './DecoratorKind';
import { Context } from '../../compilation-context/Context';

export function isDecoratorFromLibrary(decorator: ts.ModifierLike, kind: DecoratorKind | undefined): boolean {
  if (!Context.ts.isDecorator(decorator)) {
    return false;
  }

  if (Context.ts.isIdentifier(decorator.expression)) {
    const nodeSourceDescriptors = getNodeSourceDescriptor(decorator.expression);

    if (nodeSourceDescriptors === null) {
      return false;
    }

    return nodeSourceDescriptors.every(it => it.isLibraryNode && checkName(it.originalName, kind));
  }

  if (Context.ts.isCallExpression(decorator.expression)) {
    const nodeSourceDescriptors = getNodeSourceDescriptor(decorator.expression.expression);

    if (nodeSourceDescriptors === null) {
      return false;
    }

    return nodeSourceDescriptors.every(it => it.isLibraryNode && checkName(it.originalName, kind));
  }

  return false;
}

function checkName(name: string | null, kind: DecoratorKind | undefined): boolean {
  if (name === null) {
    return false;
  }

  if (kind === undefined) {
    return DecoratorKinds.has(name as any);
  }

  return name === kind;
}
