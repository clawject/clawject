import ts, { factory } from 'typescript';
import { transformPropertyBean } from './transformPropertyBean';
import { transformMethodBean } from './transformMethodBean';
import { transformArrowFunctionOrExpressionBean } from './transformArrowFunctionOrExpressionBean';
import { Configuration } from '../../configuration/Configuration';
import { BeanKind } from '../../bean/BeanKind';
import { Bean, BeanNode } from '../../bean/Bean';
import { ClassPropertyWithArrowFunctionInitializer, ClassPropertyWithCallExpressionInitializer, ClassPropertyWithExpressionInitializer } from '../../ts/types';

export const processMembers = (node: ts.ClassDeclaration, configuration: Configuration): ts.ClassDeclaration => {
    const newMembers = node.members.map(node => {
        const bean = configuration.beanRegister.getByNode(node as BeanNode);

        if (bean === null) {
            return node;
        }

        switch (bean.kind) {
        case BeanKind.FACTORY_METHOD:
        case BeanKind.LIFECYCLE_METHOD:
            return transformMethodBean(bean as Bean<ts.MethodDeclaration>);

        case BeanKind.CLASS_CONSTRUCTOR_BEAN:
            return transformPropertyBean(bean as Bean<ClassPropertyWithCallExpressionInitializer>);

        case BeanKind.FACTORY_ARROW_FUNCTION:
        case BeanKind.LIFECYCLE_ARROW_FUNCTION:
        case BeanKind.VALUE_EXPRESSION:
            return transformArrowFunctionOrExpressionBean(bean as Bean<ClassPropertyWithArrowFunctionInitializer | ClassPropertyWithExpressionInitializer>);
        }

        return node;
    });

    return factory.updateClassDeclaration(
        node,
        node.modifiers,
        node.name,
        node.typeParameters,
        node.heritageClauses,
        newMembers
    );
};
