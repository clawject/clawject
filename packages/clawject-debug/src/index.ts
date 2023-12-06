import {Bean, CatContext, ContainerManager, PostConstruct} from '@clawject/di';

interface Config {
  data: string;
}

class ApplicationContext extends CatContext<{ configDataValue: string }, Config> {
  @Bean configDataValue = this.config.data;
}

const config: Config = {
  data: 'dataValue'
};

const initializedContext = ContainerManager.init(
  ApplicationContext,
  {config}
);

console.log(initializedContext.getBean('configDataValue'));
