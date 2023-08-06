import { Component } from '../component/Component';
import { DIType } from '../type-system/DIType';
import { Configuration } from '../configuration/Configuration';
import { Entity } from '../Entity';

export class Autowired extends Entity {
  declare id: string; //Set by AutowiredRegister during registration
  declare parent: Configuration | Component; //Set by AutowiredRegister during registration
  declare diType: DIType;
  declare classMemberName: string;
  qualifier: string | null = null;

  constructor(values: Partial<Autowired> = {}) {
    super();

    Object.assign(this, values);
  }
}
