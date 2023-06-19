import ts from 'typescript';
import { AutowiredRegister } from '../../autowired/AutowiredRegister';
import { Dependency } from '../../dependency/Dependency';

//TODO add stereotype components
export class Component {
    declare id: string;
    declare fileName: string;
    declare name: string | null;
    declare node: ts.ClassDeclaration;

    autowiredRegister = new AutowiredRegister(this);
    constructorDependencies = new Set<Dependency>();

    relatedPaths = new Set<string>();
}
