import {Bean, CatContext, ContainerManager, PostConstruct} from '@clawject/di';
import {TestClass} from './TestClass';

class ApplicationContext extends CatContext {
  testClass = Bean(TestClass);
}

ContainerManager.init(ApplicationContext);
