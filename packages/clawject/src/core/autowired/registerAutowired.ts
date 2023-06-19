import { Configuration } from '../configuration/Configuration';
import { Component } from '../application-mode/component/Component';
import { isAutowiredClassElement } from '../ts/predicates/isAutowiredClassElement';
import { DITypeBuilder } from '../type-system/DITypeBuilder';
import { AutowiredElement } from './AutowiredElement';
import { getCompilationContext } from '../../transformers/getCompilationContext';

export const registerAutowired = (parent: Configuration | Component) => {
    const compilationContext = getCompilationContext();
    const typeChecker = compilationContext.typeChecker;

    parent.node.members.forEach(member => {
        if (isAutowiredClassElement(member)) {
            const type = typeChecker.getTypeAtLocation(member);
            const diType = DITypeBuilder.build(type);

            const autowiredElement = new AutowiredElement({
                node: member,
                name: member.name.getText(), //TODO handle names
                diType: diType,
            });
            parent.autowiredRegister.register(autowiredElement);
            return;
        }
    });
};
