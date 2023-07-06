import ts, { factory } from 'typescript';
import { transformPropertyBean } from './transformPropertyBean';
import { transformMethodBean } from './transformMethodBean';
import { transformArrowFunctionBean } from './transformArrowFunctionBean';
import { transformExpressionBean } from './transformExpressionBean';
import { Configuration } from '../../configuration/Configuration';
import { BeanKind } from '../../bean/BeanKind';
import { BeanNode, Bean } from '../../bean/Bean';
import {
    ClassPropertyWithArrowFunctionInitializer,
    ClassPropertyWithCallExpressionInitializer,
    ClassPropertyWithExpressionInitializer
} from '../../ts/types';

export const processMembers = (node: ts.ClassDeclaration, configuration: Configuration): ts.ClassDeclaration => {
    const newMembers = node.members.map(node => {
        const bean = configuration.beanRegister.getByNode(node as BeanNode);

        if (bean === null) {
            return node;
        }

        switch (bean.kind) {
        case BeanKind.METHOD:
        case BeanKind.LIFECYCLE_METHOD:
            return transformMethodBean(bean as Bean<ts.MethodDeclaration>);

        case BeanKind.PROPERTY:
            return transformPropertyBean(bean as Bean<ClassPropertyWithCallExpressionInitializer>);

        case BeanKind.ARROW_FUNCTION:
        case BeanKind.LIFECYCLE_ARROW_FUNCTION:
            return transformArrowFunctionBean(bean as Bean<ClassPropertyWithArrowFunctionInitializer>);

        case BeanKind.EXPRESSION:
            return transformExpressionBean(bean as Bean<ClassPropertyWithExpressionInitializer>);
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
