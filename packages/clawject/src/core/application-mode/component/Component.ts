import ts from 'typescript';
import { AutowiredRegister } from '../../autowired/AutowiredRegister';
import { Dependency } from '../../dependency/Dependency';
import { IDProvider } from '../../utils/IDProvider';

//TODO add stereotype components
export class Component {
    declare id: string;
    declare fileName: string;
    declare name: string | null;
    declare node: ts.ClassDeclaration;
    runtimeId = IDProvider.next();

    autowiredRegister = new AutowiredRegister(this);
    constructorDependencies = new Set<Dependency>();

    relatedPaths = new Set<string>();
}
