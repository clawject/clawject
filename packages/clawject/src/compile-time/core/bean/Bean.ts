import ts from 'typescript';
import { DIType } from '../type-system/DIType';
import { ClassPropertyWithArrowFunctionInitializer, ClassPropertyWithCallExpressionInitializer, ClassPropertyWithExpressionInitializer } from '../ts/types';
import { BeanKind } from './BeanKind';
import { Configuration } from '../configuration/Configuration';
import { Dependency } from '../dependency/Dependency';
import { BaseElement } from '../BaseElement';
import { LifecycleKind } from '../component-lifecycle/LifecycleKind';
import { DisposableNodeHolder } from '../DisposableNodeHolder';

export type BeanNode = ts.MethodDeclaration
    | ClassPropertyWithCallExpressionInitializer
    | ClassPropertyWithArrowFunctionInitializer
    | ts.PropertyDeclaration
    | ClassPropertyWithExpressionInitializer;

export class Bean<T extends BeanNode = BeanNode> extends BaseElement<T> {
    constructor(values: Partial<Bean> = {}) {
        super();

        Object.assign(this, values);
    }

    declare id: string; //Set by Context or Configuration during registration
    declare parentConfiguration: Configuration; //Set by Context or Configuration during registration
    declare classMemberName: string;
    declare diType: DIType;
    declare kind: BeanKind;

    classDeclaration: ts.ClassDeclaration | null = null;
    nestedProperty: string | null = null;
    lifecycle: LifecycleKind[] | null = null;
    public = false;
    dependencies = new Set<Dependency>();
    nestedBeans = new Set<Bean>();

    scopeExpression = new DisposableNodeHolder<ts.Expression>();
    lazyExpression = new DisposableNodeHolder<ts.Expression>();

    isLifecycle(): boolean {
        return this.kind === BeanKind.LIFECYCLE_METHOD || this.kind === BeanKind.LIFECYCLE_ARROW_FUNCTION;
    }

    get fullName(): string {
        if (this.nestedProperty === null) {
            return this.classMemberName;
        }

        return `${this.classMemberName}.${this.nestedProperty}`;
    }
}