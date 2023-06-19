import { Component } from '../application-mode/component/Component';
import { DIType } from '../type-system/DIType';
import ts from 'typescript';
import { Configuration } from '../configuration/Configuration';

export class AutowiredElement {
    constructor(values: Partial<AutowiredElement> = {}) {
        Object.assign(this, values);
    }

    declare id: string; //Set by AutowiredRegister during registration
    declare parent: Configuration | Component; //Set by AutowiredRegister during registration
    declare name: string;
    declare diType: DIType;
    declare node: ts.Node;

    //TODO
    resolved: unknown | null = null;
}
