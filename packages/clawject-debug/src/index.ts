import {Bean, CatContext} from '@clawject/di';

class Bar<T = string> {
  constructor(data: T) {}
}

class ApplicationContext extends CatContext {
  @Bean str = '';

  /* The type of parameter `data` will be `string` */
  bar = Bean(Bar);
}
