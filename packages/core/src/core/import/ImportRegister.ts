import { Configuration } from '../configuration/Configuration';
import { AbstractElementRegister } from '../element-register/AbstractElementRegister';
import { Import } from './Import';
import type * as ts from 'typescript';

export class ImportRegister extends AbstractElementRegister<Import, ts.PropertyDeclaration> {
  constructor(
    public parent: Configuration,
  ) {
    super();
  }

  override register(imp: Import): void {
    imp.id = `${this.parent.id}_${this.counter}`;
    this.counter++;

    imp.parentConfiguration = this.parent;

    this.elements.add(imp);
    this.idToElement.set(imp.id, imp);
    this.nodeToElement.set(imp.node, imp);
  }
}
