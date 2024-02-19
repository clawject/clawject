import { Bean, ClawjectApplication } from '@clawject/di';

@ClawjectApplication
class Application {
  d = Bean(A);
}
