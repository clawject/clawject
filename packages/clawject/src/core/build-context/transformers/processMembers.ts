import ts, { factory } from 'typescript';
import { transformPropertyBean } from './transformPropertyBean';
import { transformMethodBean } from './transformMethodBean';
import { transformArrowFunctionBean } from './transformArrowFunctionBean';
import { transformExpressionOrEmbeddedBean } from './transformExpressionOrEmbeddedBean';
import { Context } from '../../context/Context';
import { BeanKind } from '../../bean/BeanKind';
import { BeanNode, ContextBean } from '../../bean/ContextBean';
import {
    ClassPropertyWithArrowFunctionInitializer,
    ClassPropertyWithCallExpressionInitializer,
    ClassPropertyWithExpressionInitializer
} from '../../ts/types';

export const processMembers = (node: ts.ClassDeclaration, context: Context): ts.ClassDeclaration => {
    const newMembers = node.members.map(node => {
        const bean = context.getBeanByNode(node as BeanNode);

        if (bean === null) {
            return node;
        }

        switch (bean.kind) {
        case BeanKind.METHOD:
        case BeanKind.LIFECYCLE_METHOD:
            return transformMethodBean(bean as ContextBean<ts.MethodDeclaration>);

        case BeanKind.PROPERTY:
            return transformPropertyBean(bean as ContextBean<ClassPropertyWithCallExpressionInitializer>);

        case BeanKind.ARROW_FUNCTION:
        case BeanKind.LIFECYCLE_ARROW_FUNCTION:
            return transformArrowFunctionBean(bean as ContextBean<ClassPropertyWithArrowFunctionInitializer>);

        case BeanKind.EXPRESSION:
        case BeanKind.EMBEDDED:
            return transformExpressionOrEmbeddedBean(bean as ContextBean<ClassPropertyWithExpressionInitializer>);
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
