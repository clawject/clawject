import { Configuration } from '../configuration/Configuration';
import { Bean, BeanNode } from './Bean';
import { AbstractElementRegister } from '../element-register/AbstractElementRegister';
import { FileGraph } from '../file-graph/FileGraph';

export class BeanRegister extends AbstractElementRegister<Bean, BeanNode> {
  constructor(
    public parent: Configuration,
  ) {
    super();
  }

  override register(bean: Bean): void {
    bean.id = `${this.parent.id}_${this.counter}`;
    this.counter++;

    bean.parentConfiguration = this.parent;

    this.elements.add(bean);
    this.idToElement.set(bean.id, bean);
    this.nodeToElement.set(bean.node, bean);

    const beanClassDeclarationFileName = bean.classDeclaration?.node.getSourceFile().fileName;
    bean.diType.declarations.map(it => {
      FileGraph.add(this.parent.fileName, it.fileName);
    });
    beanClassDeclarationFileName && FileGraph.add(this.parent.fileName, beanClassDeclarationFileName);
  }
}
