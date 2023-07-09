import ts, { factory } from 'typescript';
import { Bean } from '../../../bean/Bean';
import { InternalsAccessBuilder } from '../../../internals-access/InternalsAccessBuilder';
import { isDecoratorFromLibrary } from '../../../decorator-processor/isDecoratorFromLibrary';

export const transformConfigurationMethodBean = (bean: Bean<ts.MethodDeclaration>): ts.MethodDeclaration => {
  const nodeBody = bean.node.body ?? factory.createBlock([]);
  const beansVariables = Array.from(bean.dependencies).map(dependency => {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [factory.createVariableDeclaration(
          factory.createIdentifier(dependency.parameterName),
          undefined,
          dependency.node.type,
          InternalsAccessBuilder.internalGetInstanceCallExpression(dependency.runtimeId)
        )],
        ts.NodeFlags.Const
      )
    );
  });

  const newBody = factory.updateBlock(
    nodeBody,
    [
      ...beansVariables,
      ...nodeBody.statements,
    ]
  );


  return factory.updateMethodDeclaration(
    bean.node,
    bean.node.modifiers?.filter(modifier => !isDecoratorFromLibrary(modifier, undefined)),
    undefined,
    bean.node.name,
    undefined,
    undefined,
    [],
    bean.node.type,
    newBody,
  );
};

