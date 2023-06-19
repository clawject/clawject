import ts from 'typescript';
import { AutowiredRegister } from '../../autowired/AutowiredRegister';

export class Component {
    declare id: string;
    declare node: ts.ClassDeclaration;
    relatedPaths = new Set<string>();

    autowiredRegister = new AutowiredRegister(this);
}
