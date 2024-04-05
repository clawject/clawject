import type * as ts from 'typescript';
import { DeclarationMetadata } from './DeclarationMetadata';
import { CompileTimeElement } from './CompileTimeElement';
import { AbstractCompilationMessage } from '../../compilation-context/messages/AbstractCompilationMessage';
import { CorruptedMetadataError } from '../../compilation-context/messages/errors/CorruptedMetadataError';
import { Context } from '../../compilation-context/Context';

export class DeclarationMetadataParser {
  static parse(classDeclaration: ts.ClassDeclaration): DeclarationMetadata | AbstractCompilationMessage | null {
    const metadataProperty = classDeclaration.members.find(it => {
      if (!Context.ts.isPropertyDeclaration(it)) {
        return false;
      }

      return it.name?.getText() === CompileTimeElement.COMPILE_TIME_METADATA;
    }) as ts.PropertyDeclaration | undefined;

    if (!metadataProperty) {
      return null;
    }

    const declarationTypeNode = metadataProperty.type;

    if (!declarationTypeNode || !Context.ts.isTypeLiteralNode(declarationTypeNode)) {
      return new CorruptedMetadataError(
        'Compiled metadata property must have type literal node.',
        classDeclaration,
        null,
        null,
      );
    }

    return this.parseTypeNode(declarationTypeNode);
  }

  private static parseTypeNode(node: ts.TypeNode): any | null {
    switch (true) {
    case Context.ts.isTypeLiteralNode(node): {
      const typedNode = node as ts.TypeLiteralNode;

      return typedNode.members.filter(Context.ts.isPropertySignature).reduce((acc, member) => {
        acc[member.name?.getText() ?? ''] = this.parseTypeNode(member.type ?? Context.factory.createKeywordTypeNode(Context.ts.SyntaxKind.UnknownKeyword));
        return acc;
      }, {});
    }

    case Context.ts.isTupleTypeNode(node): {
      const typedNode = node as ts.TupleTypeNode;

      return typedNode.elements.map(it => this.parseTypeNode(it));
    }

    case Context.ts.isLiteralTypeNode(node): {
      const typedNode = node as ts.LiteralTypeNode;

      switch (typedNode.literal.kind) {
      case Context.ts.SyntaxKind.NullKeyword:
        return null;
      case Context.ts.SyntaxKind.TrueKeyword:
        return true;
      case Context.ts.SyntaxKind.FalseKeyword:
        return false;
      case Context.ts.SyntaxKind.StringLiteral:
        return typedNode.literal.text;
      case Context.ts.SyntaxKind.NumericLiteral:
        return Number(typedNode.literal.text);
      default:
        return new CorruptedMetadataError(
          `Could not parse metadata literal type node, kind: ${typedNode.literal.kind}`,
          typedNode.literal,
          null,
          null,
        );
      }
    }
    default:
      return new CorruptedMetadataError(
        `Could not parse metadata literal type node, kind: ${node.kind}`,
        node,
        null,
        null,
      );
    }
  }
}
