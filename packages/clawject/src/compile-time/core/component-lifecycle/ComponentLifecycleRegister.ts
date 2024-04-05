import type * as ts from 'typescript';
import { Component } from '../component/Component';
import { AbstractElementRegister } from '../element-register/AbstractElementRegister';
import { ComponentLifecycle } from './ComponentLifecycle';

export class ComponentLifecycleRegister extends AbstractElementRegister<ComponentLifecycle, ts.Node> {
  constructor(
    public parent: Component,
  ) {
    super();
  }

  override register(componentLifecycle: ComponentLifecycle): void {
    componentLifecycle.id = `${this.parent.id}_${this.counter}`;
    this.counter++;

    this.elements.add(componentLifecycle);
    this.idToElement.set(componentLifecycle.id, componentLifecycle);
    this.nodeToElement.set(componentLifecycle.node, componentLifecycle);
  }
}
