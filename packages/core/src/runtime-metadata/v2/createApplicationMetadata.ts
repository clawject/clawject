import type ts from 'typescript';
import { Application } from '../../core/application/Application';
import { Context } from '../../compilation-context/Context';
import {
  InternalElementKind,
  InternalsAccessBuilder,
} from '../../core/internals-access/InternalsAccessBuilder';
import { Configuration } from '../../core/configuration/Configuration';
import { Bean } from '../../core/bean/Bean';
import { getPredecessors } from '../../core/graph-utils/getPredecessors';
import { ConfigurationRepository } from '../../core/configuration/ConfigurationRepository';
import { Import } from '../../core/import/Import';
import { ResolvedDependencyKind } from '../../core/dependency-resolver/ResolvedDependency';
import { createBoolean } from '../../core/ts/utils/createBoolean';

const MULTILINE = true;

export const createApplicationMetadata = (
  application: Application
): ts.ClassStaticBlockDeclaration => {
  const factory = Context.factory;
  const runtimeUtilsIdentifier =
    InternalsAccessBuilder.internalPropertyAccessExpression(
      InternalElementKind.ClawjectInternalRuntimeUtils
    );
  const symbolsIdentifier = factory.createIdentifier('_');
  const symbolsCount =
    application.configurationsArray.length +
    application.importsArray.length +
    application.beansArray.length;

  const indexMap = createIndexMap(application);
  const getSymbol = getGetSymbolExpression(symbolsIdentifier, indexMap);

  const symbolsConstant = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          symbolsIdentifier,
          undefined,
          undefined,
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              runtimeUtilsIdentifier,
              factory.createIdentifier('createSizedSymbolArray')
            ),
            undefined,
            [factory.createNumericLiteral(symbolsCount.toString())]
          )
        ),
      ],
      Context.ts.NodeFlags.Const
    )
  );
  const rootConfigurationSymbolProperty = createObjectProperty(
    'rootConfigurationSymbol',
    getSymbol(application.rootConfiguration)
  );
  const configurationImportersProperty = createObjectProperty(
    'configurationImporters',
    factory.createCallExpression(
      factory.createPropertyAccessExpression(
        runtimeUtilsIdentifier,
        factory.createIdentifier('createMap')
      ),
      undefined,
      [
        factory.createArrayLiteralExpression(
          application.configurationsArray.map((configuration) => {
            const configurationSymbol = getSymbol(configuration);
            const importers = getPredecessors(
              application.importGraph!,
              configuration.id,
              (id) =>
                ConfigurationRepository.configurationIdToConfiguration.get(id)!
            );

            return factory.createArrayLiteralExpression([
              configurationSymbol,
              factory.createArrayLiteralExpression(
                importers.map((importer) => getSymbol(importer))
              ),
            ]);
          }),
          MULTILINE
        ),
      ]
    )
  );
  const beanSymbolToMetadataProperty = createObjectProperty(
    'beanSymbolToMetadata',
    factory.createCallExpression(
      factory.createPropertyAccessExpression(
        runtimeUtilsIdentifier,
        factory.createIdentifier('createMap')
      ),
      undefined,
      [
        factory.createArrayLiteralExpression(
          application.beansArray.map((bean) => {
            const beanSymbol = getSymbol(bean);
            const parentConfigurationSymbol = getSymbol(bean.parentConfiguration);
            const properties = bean.embeddedParent
              ? [
                getSymbol(bean.embeddedParent),
                factory.createStringLiteral(bean.nestedProperty as string),
              ]
              : [factory.createStringLiteral(bean.classMemberName)];
            const kind = createNumericLiteral(bean.kind);

            return factory.createArrayLiteralExpression([
              beanSymbol,
              factory.createArrayLiteralExpression([
                factory.createArrayLiteralExpression(properties),
                kind,
                parentConfigurationSymbol,
              ]),
            ]);
          }),
          MULTILINE
        ),
      ]
    )
  );
  const configurationBeanSymbolsProperty = createObjectProperty(
    'configurationBeanSymbols',
    factory.createCallExpression(
      factory.createPropertyAccessExpression(
        runtimeUtilsIdentifier,
        factory.createIdentifier('createMap')
      ),
      undefined,
      [
        factory.createArrayLiteralExpression(
          application.configurationsArray.map((configuration) => {
            const configurationSymbol = getSymbol(configuration);
            const beanSymbols = new Array<ts.Expression>(
              configuration.beanRegister.elements.size
            );
            let i = 0;
            for (const bean of configuration.beanRegister.elements) {
              beanSymbols[i++] = getSymbol(bean);
            }

            return factory.createArrayLiteralExpression([
              configurationSymbol,
              factory.createArrayLiteralExpression(beanSymbols),
            ]);
          }),
          MULTILINE
        ),
      ]
    )
  );
  const importSymbolToMetadataProperty = createObjectProperty(
    'importSymbolToMetadata',
    factory.createCallExpression(
      factory.createPropertyAccessExpression(
        runtimeUtilsIdentifier,
        factory.createIdentifier('createMap')
      ),
      undefined,
      [
        factory.createArrayLiteralExpression(
          application.importsArray.map((importElement) => {
            const importSymbol = getSymbol(importElement);

            const configurationSymbol = getSymbol(
              importElement.resolvedConfiguration
            );
            const importProperty = factory.createStringLiteral(importElement.classMemberName);
            //TODO add callable from import element
            const callable = createBoolean(false);

            return factory.createArrayLiteralExpression([
              importSymbol,
              factory.createArrayLiteralExpression([
                importProperty,
                configurationSymbol,
                callable,
              ]),
            ]);
          }),
          MULTILINE
        ),
      ]
    )
  );
  const configurationImportSymbolsProperty = createObjectProperty(
    'configurationImportSymbols',
    factory.createCallExpression(
      factory.createPropertyAccessExpression(
        runtimeUtilsIdentifier,
        factory.createIdentifier('createMap')
      ),
      undefined,
      [
        factory.createArrayLiteralExpression(
          application.configurationsArray.map((configuration) => {
            const configurationSymbol = getSymbol(configuration);
            const symbols = new Array<ts.Expression>(
              configuration.importRegister.elements.size
            );
            let i = 0;
            for (const element of configuration.importRegister.elements) {
              symbols[i++] = getSymbol(element);
            }

            return factory.createArrayLiteralExpression([
              configurationSymbol,
              factory.createArrayLiteralExpression(symbols),
            ]);
          }),
          MULTILINE
        ),
      ]
    )
  );
  const beanDependenciesProperty = createObjectProperty(
    'beanDependencies',
    factory.createCallExpression(
      factory.createPropertyAccessExpression(
        runtimeUtilsIdentifier,
        factory.createIdentifier('createMap')
      ),
      undefined,
      [
        factory.createArrayLiteralExpression(
          application.beansArray.map((bean) => {
            const beanSymbol = getSymbol(bean);
            const resolvedDependencies =
              application.resolvedBeanDependencies.get(bean) ?? [];
            const dependenciesMetadata = resolvedDependencies.map((it) => {
              switch (it.kind) {
              case ResolvedDependencyKind.ApplicationRef: {
                return [createNumericLiteral(it.kind)];
              }

              case ResolvedDependencyKind.Bean:
              case ResolvedDependencyKind.Lazy:
              case ResolvedDependencyKind.ConfigurationRef:
              case ResolvedDependencyKind.LazyConfigurationLoader: {
                return [createNumericLiteral(it.kind), getSymbol(it.target)];
              }

              case ResolvedDependencyKind.Map:
              case ResolvedDependencyKind.Set:
              case ResolvedDependencyKind.Array: {
                const targets = it.target.map(getSymbol);
                return [
                  createNumericLiteral(it.kind),
                  factory.createArrayLiteralExpression(targets),
                ];
              }
              }
            });

            return factory.createArrayLiteralExpression([
              beanSymbol,
              factory.createArrayLiteralExpression(
                dependenciesMetadata.map((it) =>
                  factory.createArrayLiteralExpression(it)
                )
              ),
            ]);
          }),
          MULTILINE
        ),
      ]
    )
  );

  const metadataObject = factory.createObjectLiteralExpression(
    [
      rootConfigurationSymbolProperty,
      configurationImportersProperty,
      beanSymbolToMetadataProperty,
      configurationBeanSymbolsProperty,
      importSymbolToMetadataProperty,
      configurationImportSymbolsProperty,
      beanDependenciesProperty,
    ],
    MULTILINE
  );

  return factory.createClassStaticBlockDeclaration(
    factory.createBlock(
      [
        symbolsConstant,
        factory.createExpressionStatement(
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              runtimeUtilsIdentifier,
              factory.createIdentifier('defineApplicationMetadata')
            ),
            undefined,
            [application.node.name ?? factory.createThis(), metadataObject]
          )
        ),
      ],
      true
    )
  );
};

class IndexMap<K = Configuration | Bean | Import, V = number> {
  private map = new Map<K, V>();

  set(key: K, value: V): void {
    this.map.set(key, value);
  }

  get(key: K): V {
    const value = this.map.get(key);
    if (value === undefined) {
      throw new Error('Index not found');
    }

    return value;
  }
}

function createIndexMap(application: Application): IndexMap {
  const indexMap = new IndexMap();

  let i = 0;
  for (let j = 0; j < application.configurationsArray.length; j++, i++) {
    indexMap.set(application.configurationsArray[j], i);
  }
  for (let j = 0; j < application.importsArray.length; j++, i++) {
    indexMap.set(application.importsArray[j], i);
  }
  for (let j = 0; j < application.beansArray.length; j++, i++) {
    indexMap.set(application.beansArray[j], i);
  }

  return indexMap;
}

function getGetSymbolExpression(
  symbolsIdentifier: ts.Identifier,
  indexMap: IndexMap
): (key: Configuration | Bean | Import) => ts.ElementAccessExpression {
  return (key: Configuration | Bean | Import) => {
    return Context.factory.createElementAccessExpression(
      symbolsIdentifier,
      Context.factory.createNumericLiteral(indexMap.get(key).toString())
    );
  };
}

function createObjectProperty(
  name: string,
  value: ts.Expression
): ts.PropertyAssignment {
  return Context.factory.createPropertyAssignment(
    Context.factory.createIdentifier(name),
    value
  );
}

function createNumericLiteral(value: number): ts.Expression {
  const absLiteral = Context.factory.createNumericLiteral(Math.abs(value));

  if (value < 0) {
    return Context.factory.createPrefixUnaryExpression(
      Context.ts.SyntaxKind.MinusToken,
      absLiteral
    );
  }

  return absLiteral;
}
