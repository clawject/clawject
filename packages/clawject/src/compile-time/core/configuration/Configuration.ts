import ts from 'typescript';
import { DIType } from '../type-system/DIType';
import { AutowiredRegister } from '../autowired/AutowiredRegister';
import { BeanRegister } from '../bean/BeanRegister';
import { Entity } from '../Entity';
import { DisposableNodeHolder } from '../DisposableNodeHolder';
import { FileGraph } from '../file-graph/FileGraph';

export class Configuration extends Entity<ts.ClassDeclaration> {
  declare id: string;
  declare fileName: string;

  className: string | null = null;
  diType: DIType | null = null;

  autowiredRegister = new AutowiredRegister(this);
  beanRegister = new BeanRegister(this);

  scopeExpression = new DisposableNodeHolder<ts.Expression>();
  lazyExpression = new DisposableNodeHolder<ts.Expression>();

  registerDIType(diType: DIType): void {
    this.diType = diType;
    diType.declarations.map(it => {
      FileGraph.add(this.fileName, it.fileName);
    });
  }
}
