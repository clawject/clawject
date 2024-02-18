import {Bean, ClawjectApplication, PostConstruct} from '@clawject/di';
import {Test} from './Test';
import {RequestedBean} from './RequestedBean';

@ClawjectApplication
class Application {
  test = Bean(Test);
  RequestedBean = Bean(RequestedBean);
}
