import { AutowiredElement } from './AutowiredElement';
import { Component } from '../component/Component';
import { Configuration } from '../configuration/Configuration';
import { AbstractElementRegister } from '../element-register/AbstractElementRegister';

export class AutowiredRegister extends AbstractElementRegister<AutowiredElement> {
  constructor(
    public parent: Configuration | Component,
  ) {
    super();
  }

  override register(autowired: AutowiredElement): void {
    autowired.id = `${this.parent.id}_${this.counter}`;
    this.counter++;

    autowired.parent = this.parent;

    this.elements.add(autowired);
    this.idToElement.set(autowired.id, autowired);
    this.nodeToElement.set(autowired.node, autowired);

    autowired.diType.declarations.map(it => {
      this.parent.relatedPaths.add(it.fileName);
    });
  }
}
