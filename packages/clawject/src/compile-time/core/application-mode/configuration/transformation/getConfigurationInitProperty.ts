import { Configuration } from '../../../configuration/Configuration';
import ts, { factory } from 'typescript';
import { InstanceRuntimeElement } from '../../../../../runtime/runtime-elements/InstanceRuntimeElement';
import { InternalElementKind, InternalsAccessBuilder } from '../../../internals-access/InternalsAccessBuilder';

/**
 * private clawject_configuration_init = (): void => {
 *     [
 *         ['123', () => this.methodBean(
 *             ...['depId1', 'depId2']
 *                 .map(Clawject.getDependency)
 *         )]
 *     ].forEach(it => Clawject.registerBean(it[0], it[1]));
 *
 *     [['depId1', ['resolvedBeanId1', 'resolvedBeanId2']]].forEach(it => Clawject.registerDependency(it[0], it[1]))
 * }
 * */

export function getConfigurationInitProperty(configuration: Configuration): ts.ClassElement {
  const allBeans = Array.from(configuration.beanRegister.elements);

  //TODO in future - add postConstruct/preDestroy methods support
  //TODO support for embedded beans?
  const beanElements = allBeans
    .filter(it => !it.isLifecycle())
    .map(it => {
      const dependencyIds = Array.from(it.dependencies)
        .map(dependency => factory.createNumericLiteral(dependency.runtimeId));

      return factory.createArrayLiteralExpression(
        [
          factory.createNumericLiteral(it.runtimeId),
          factory.createArrowFunction(
            undefined,
            undefined,
            [],
            undefined,
            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createThis(),
                factory.createIdentifier(it.classMemberName)
              ),
              undefined,
              [factory.createSpreadElement(factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createArrayLiteralExpression(
                    dependencyIds,
                    false
                  ),
                  factory.createIdentifier('map')
                ),
                undefined,
                [factory.createPropertyAccessExpression(
                  InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.ApplicationManager),
                  factory.createIdentifier('getDependency')
                )]
              ))]
            )
          )
        ],
        false
      );
    });

  const dependencyIdToResolvedBeanIds = Array.from(configuration.beanRegister.elements)
    .map(it => Array.from(it.dependencies)).flat()
    .map(dependency => {
      return factory.createArrayLiteralExpression(
        [
          factory.createNumericLiteral(dependency.runtimeId),
          factory.createArrayLiteralExpression(
            dependency.qualifiedBeans?.map(it =>  factory.createStringLiteral(it.id)) ?? [],
            false
          )
        ],
        false
      );
    });

  return factory.createPropertyDeclaration(
    [factory.createToken(ts.SyntaxKind.PrivateKeyword)],
    factory.createIdentifier('InstanceRuntimeElement.CONFIGURATION_INIT'),
    undefined,
    undefined,
    factory.createArrowFunction(
      undefined,
      undefined,
      [],
      factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
      factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      factory.createBlock(
        [
          factory.createExpressionStatement(factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createArrayLiteralExpression(
                beanElements,
                true
              ),
              factory.createIdentifier('forEach')
            ),
            undefined,
            [factory.createArrowFunction(
              undefined,
              undefined,
              [factory.createParameterDeclaration(
                undefined,
                undefined,
                factory.createIdentifier('it'),
                undefined,
                undefined,
                undefined
              )],
              undefined,
              factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.ApplicationManager),
                  factory.createIdentifier('registerBean')
                ),
                undefined,
                [
                  factory.createElementAccessExpression(
                    factory.createIdentifier('it'),
                    factory.createNumericLiteral('0')
                  ),
                  factory.createElementAccessExpression(
                    factory.createIdentifier('it'),
                    factory.createNumericLiteral('1')
                  )
                ]
              )
            )]
          )),

          factory.createExpressionStatement(factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createArrayLiteralExpression(
                dependencyIdToResolvedBeanIds,
                false
              ),
              factory.createIdentifier('forEach')
            ),
            undefined,
            [factory.createArrowFunction(
              undefined,
              undefined,
              [factory.createParameterDeclaration(
                undefined,
                undefined,
                factory.createIdentifier('it'),
                undefined,
                undefined,
                undefined
              )],
              undefined,
              factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  InternalsAccessBuilder.internalPropertyAccessExpression(InternalElementKind.ApplicationManager),
                  factory.createIdentifier('registerDependency')
                ),
                undefined,
                [
                  factory.createElementAccessExpression(
                    factory.createIdentifier('it'),
                    factory.createNumericLiteral('0')
                  ),
                  factory.createElementAccessExpression(
                    factory.createIdentifier('it'),
                    factory.createNumericLiteral('1')
                  )
                ]
              )
            )]
          ))
        ],
        true
      )
    )
  );

}
