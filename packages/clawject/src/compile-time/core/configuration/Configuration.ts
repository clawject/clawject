import ts from 'typescript';
import { DIType } from '../type-system/DIType';
import { BeanKind } from '../bean/BeanKind';
import { AutowiredRegister } from '../autowired/AutowiredRegister';
import { BeanRegister } from '../bean/BeanRegister';
import { BaseElement } from '../BaseElement';
import { DisposableNodeHolder } from '../DisposableNodeHolder';
import { FileGraph } from '../file-graph/FileGraph';

export class Configuration extends BaseElement<ts.ClassDeclaration> {
  declare id: string;
  declare fileName: string;
  declare allowedBeanKinds: Set<BeanKind>;

  name: string | null = null;
  diType: DIType | null = null;

  autowiredRegister = new AutowiredRegister(this);
  beanRegister = new BeanRegister(this);

  lazyExpression = new DisposableNodeHolder<ts.Expression>();

  registerDIType(diType: DIType): void {
    this.diType = diType;
    diType.declarations.map(it => {
      FileGraph.add(this.fileName, it.fileName);
    });
  }
}
