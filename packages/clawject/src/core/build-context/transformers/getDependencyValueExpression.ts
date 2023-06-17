import { BeanDependency } from '../../bean-dependency/BeanDependency';
import ts, { factory } from 'typescript';
import { getBeanAccessExpression } from './getBeanAccessExpression';

export const getDependencyValueExpression = (dependency: BeanDependency): ts.Expression | undefined => {
    const qualifiedBean = dependency.qualifiedBean;
    const qualifiedBeans = dependency.qualifiedBeans;

    if (qualifiedBeans === null) {
        if (qualifiedBean === null) {
            return undefined;
        }

        return getBeanAccessExpression(qualifiedBean);
    }

    if (dependency.diType.isArray) {
        const callExpressionsForBeans = qualifiedBeans.map(qualifiedBean => {
            return getBeanAccessExpression(qualifiedBean);
        });

        return factory.createArrayLiteralExpression(
            callExpressionsForBeans,
            false
        );
    }

    if (dependency.diType.isSet) {
        const callExpressionsForBeans = qualifiedBeans.map(qualifiedBean => {
            return getBeanAccessExpression(qualifiedBean);
        });

        return factory.createCallExpression(
            factory.createPropertyAccessExpression(
                factory.createThis(),
                factory.createIdentifier('clawject_createSet')
            ),
            undefined,
            [factory.createArrayLiteralExpression(
                callExpressionsForBeans,
                false
            )]
        );
    }

    if (dependency.diType.isMapStringToAny) {
        const callExpressionsForBeans = qualifiedBeans.map(qualifiedBean => {
            return factory.createArrayLiteralExpression(
                [
                    factory.createStringLiteral(qualifiedBean.fullName),
                    getBeanAccessExpression(qualifiedBean)
                ],
                false
            );
        });

        return factory.createCallExpression(
            factory.createPropertyAccessExpression(
                factory.createThis(),
                factory.createIdentifier('clawject_createMap')
            ),
            undefined,
            [factory.createArrayLiteralExpression(
                callExpressionsForBeans,
                false
            )]
        );
    }

    return undefined;
};
