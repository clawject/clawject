import ts from 'typescript';
import { DIType } from '../type-system/DIType';
import { BeanKind } from '../bean/BeanKind';
import { AutowiredRegister } from '../autowired/AutowiredRegister';
import { BeanRegister } from '../bean/BeanRegister';

export class Configuration {
    declare id: string;
    declare fileName: string;
    declare allowedBeanKinds: Set<BeanKind>;
    declare node: ts.ClassDeclaration;

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
