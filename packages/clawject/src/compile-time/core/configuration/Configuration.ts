import ts from 'typescript';
import { DIType } from '../type-system/DIType';
import { BeanRegister } from '../bean/BeanRegister';
import { Entity } from '../Entity';
import { DisposableNodeHolder } from '../DisposableNodeHolder';
import { FileGraph } from '../file-graph/FileGraph';
import { ImportRegister } from '../import/ImportRegister';

export class Configuration extends Entity<ts.ClassDeclaration> {
  declare id: string;
  declare fileName: string;

  className: string | null = null;
  diType: DIType | null = null;
  external: boolean | null = null;

  importRegister = new ImportRegister(this);
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
