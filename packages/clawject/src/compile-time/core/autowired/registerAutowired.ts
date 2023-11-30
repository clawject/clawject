import { Configuration } from '../configuration/Configuration';
import { Component } from '../component/Component';
import { isAutowiredClassElement } from '../ts/predicates/isAutowiredClassElement';
import { Autowired } from './Autowired';
import { getCompilationContext } from '../../../transformer/getCompilationContext';
import { DITypeBuilder } from '../type-system/DITypeBuilder';

export const registerAutowired = (parent: Configuration | Component) => {
  const compilationContext = getCompilationContext();
  const typeChecker = compilationContext.typeChecker;

  parent.node.members.forEach(member => {
    if (isAutowiredClassElement(member)) {
      const type = typeChecker.getTypeAtLocation(member);
      const diType = DITypeBuilder.build(type);

      const autowiredElement = new Autowired({
        node: member,
        classMemberName: member.name.getText(), //TODO check if name is statically known
        //TODO add qualifier
        diType: diType,
      });
      parent.autowiredRegister.register(autowiredElement);
      return;
    }
  });

  //TODO verify autowired elements
};
