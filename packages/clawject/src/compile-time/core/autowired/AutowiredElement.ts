import { Component } from '../component/Component';
import { DIType } from '../type-system/DIType';
import { Configuration } from '../configuration/Configuration';
import { BaseElement } from '../BaseElement';

export class AutowiredElement extends BaseElement {
  declare id: string; //Set by AutowiredRegister during registration
  declare parent: Configuration | Component; //Set by AutowiredRegister during registration
  declare name: string;
  declare diType: DIType;
  //TODO
  resolved: unknown | null = null;

  constructor(values: Partial<AutowiredElement> = {}) {
    super();

    Object.assign(this, values);
  }
}
