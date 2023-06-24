import ts from 'typescript';
import { DIType } from '../type-system/DIType';
import { BeanKind } from '../bean/BeanKind';
import { AutowiredRegister } from '../autowired/AutowiredRegister';
import { BeanRegister } from '../bean/BeanRegister';
import { BaseElement } from '../BaseElement';

export class Configuration extends BaseElement<ts.ClassDeclaration> {
    declare id: string;
    declare fileName: string;
    declare allowedBeanKinds: Set<BeanKind>;

    name: string | null = null;
    relatedPaths = new Set<string>();
    diType: DIType | null = null;

    autowiredRegister = new AutowiredRegister(this);
    beanRegister = new BeanRegister(this);

    registerDIType(diType: DIType): void {
        diType.declarations.map(it => {
            this.relatedPaths.add(it.fileName);
        });
    }
}
