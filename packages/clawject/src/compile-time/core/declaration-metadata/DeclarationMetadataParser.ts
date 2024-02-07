import ts, { factory, SyntaxKind } from 'typescript';
import { DeclarationMetadata } from './DeclarationMetadata';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { CompileTimeElement } from './CompileTimeElement';
import { AbstractCompilationMessage } from '../../compilation-context/messages/AbstractCompilationMessage';
import { CorruptedMetadataError } from '../../compilation-context/messages/errors/CorruptedMetadataError';

export class DeclarationMetadataParser {
  static parse(classDeclaration: ts.ClassDeclaration): DeclarationMetadata | AbstractCompilationMessage | null {
    const typeChecker = getCompilationContext().typeChecker;
    const type = typeChecker.getTypeAtLocation(classDeclaration);

    const metadataSymbol = type.getProperties()
      .find(it => it.name === CompileTimeElement.COMPILE_TIME_METADATA);

    if (!metadataSymbol) {
      return null;
    }

    const declarations = metadataSymbol.getDeclarations() ?? [];

    if (declarations.length === 0) {
      return null;
    }

    if (declarations.length > 1) {
      return new CorruptedMetadataError(
        `Compiled metadata must have exactly one declaration, but found ${declarations.length}.`,
        classDeclaration,
        null,
      );
    }

    const metadataDeclaration = declarations[0];
    const declarationTypeNode = (metadataDeclaration as ts.PropertyDeclaration).type;

    if (!declarationTypeNode || !ts.isTypeLiteralNode(declarationTypeNode)) {
      return new CorruptedMetadataError(
        'Compiled metadata property must have type literal node.',
        classDeclaration,
        null,
      );
    }

    return this.parseTypeNode(declarationTypeNode);
  }

  private static parseTypeNode(node: ts.TypeNode): any | null {
    switch (true) {
    case ts.isTypeLiteralNode(node): {
      const typedNode = node as ts.TypeLiteralNode;

      return typedNode.members.filter(ts.isPropertySignature).reduce((acc, member) => {
        acc[member.name?.getText() ?? ''] = this.parseTypeNode(member.type ?? factory.createKeywordTypeNode(SyntaxKind.UnknownKeyword));
        return acc;
      }, {});
    }

    case ts.isTupleTypeNode(node): {
      const typedNode = node as ts.TupleTypeNode;

      return typedNode.elements.map(it => this.parseTypeNode(it));
    }

    case ts.isLiteralTypeNode(node): {
      const typedNode = node as ts.LiteralTypeNode;

      switch (typedNode.literal.kind) {
      case ts.SyntaxKind.NullKeyword:
        return null;
      case ts.SyntaxKind.TrueKeyword:
        return true;
      case ts.SyntaxKind.FalseKeyword:
        return false;
      case ts.SyntaxKind.StringLiteral:
        return typedNode.literal.text;
      case ts.SyntaxKind.NumericLiteral:
        return Number(typedNode.literal.text);
      default:
        return new CorruptedMetadataError(
          `Could not parse metadata literal type node, kind: ${typedNode.literal.kind}`,
          typedNode.literal,
          null,
        );
      }
    }
    default:
      return new CorruptedMetadataError(
        `Could not parse metadata literal type node, kind: ${node.kind}`,
        node,
        null,
      );
    }
  }
}
