import ts, { factory } from 'typescript';
import { DeclarationMetadataKind } from './DeclarationMetadata';
import { CompileTimeElement } from './CompileTimeElement';
import { Configuration } from '../configuration/Configuration';

export class DeclarationMetadataBuilder {
  private static METADATA_VERSION = '1';

  static buildForConfiguration(configuration: Configuration): ts.PropertyDeclaration {
    const beans = Array.from(configuration.beanRegister.elements).map(bean =>
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier(bean.classMemberName),
        undefined,
        factory.createTypeLiteralNode([
          factory.createPropertySignature(
            undefined,
            factory.createIdentifier('qualifier'),
            undefined,
            factory.createLiteralTypeNode(
              bean.qualifier === null
                ? factory.createNull()
                : factory.createStringLiteral(bean.qualifier)
            )
          ),
          factory.createPropertySignature(
            undefined,
            factory.createIdentifier('primary'),
            undefined,
            factory.createLiteralTypeNode(
              bean.primary ? factory.createTrue() : factory.createFalse()
            )
          ),
          factory.createPropertySignature(
            undefined,
            factory.createIdentifier('kind'),
            undefined,
            factory.createLiteralTypeNode(factory.createStringLiteral(bean.kind)),
          ),
          factory.createPropertySignature(
            undefined,
            factory.createIdentifier('nestedProperty'),
            undefined,
            factory.createLiteralTypeNode(
              bean.nestedProperty === null ? factory.createNull() : factory.createStringLiteral(bean.nestedProperty)
            ),
          ),
        ])
      )
    );
    const imports = Array.from(configuration.importRegister.elements).map(it => factory.createPropertySignature(
      undefined,
      factory.createIdentifier(it.classMemberName),
      undefined,
      factory.createTypeLiteralNode([])
    ));

    return factory.createPropertyDeclaration(
      [],
      factory.createPrivateIdentifier(CompileTimeElement.COMPILE_TIME_METADATA),
      undefined,
      factory.createIntersectionTypeNode([
        factory.createTypeLiteralNode([
          factory.createPropertySignature(
            undefined,
            factory.createIdentifier('kind'),
            undefined,
            factory.createLiteralTypeNode(factory.createStringLiteral(DeclarationMetadataKind.CONFIGURATION))
          ),
          factory.createPropertySignature(
            undefined,
            factory.createIdentifier('version'),
            undefined,
            factory.createLiteralTypeNode(factory.createNumericLiteral(this.METADATA_VERSION))
          ),
          factory.createPropertySignature(
            undefined,
            factory.createIdentifier('beans'),
            undefined,
            factory.createTypeLiteralNode(beans)
          ),
          factory.createPropertySignature(
            undefined,
            factory.createIdentifier('imports'),
            undefined,
            factory.createTypeLiteralNode(imports)
          )
        ]),
        factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword)
      ]),
      undefined
    );
  }
}
