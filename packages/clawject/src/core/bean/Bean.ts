import ts from 'typescript';
import { DIType } from '../type-system/DIType';
import { ClassPropertyWithArrowFunctionInitializer, ClassPropertyWithCallExpressionInitializer, ClassPropertyWithExpressionInitializer } from '../ts/types';
import { BeanScope } from './BeanScope';
import { BeanKind } from './BeanKind';
import { Configuration } from '../configuration/Configuration';
import { Dependency } from '../dependency/Dependency';
import { BaseElement } from '../BaseElement';
import { LifecycleKind } from '../component-lifecycle/LifecycleKind';

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
    scope: BeanScope = BeanScope.SINGLETON;
    lifecycle: LifecycleKind[] | null = null;
    public = false;
    dependencies = new Set<Dependency>();

    get fullName(): string {
        if (this.nestedProperty === null) {
            return this.classMemberName;
        }

        return `${this.classMemberName}.${this.nestedProperty}`;
    }
}
