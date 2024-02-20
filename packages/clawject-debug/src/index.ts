import {Bean, ClawjectApplication, PostConstruct} from '@clawject/di';

type MyFunction1 = () => void
type MyFunction2 = (arg: number) => void

@ClawjectApplication
class Application {
  @Bean function1 = (): MyFunction1 => () => {};
  @Bean function2 = (): MyFunction2 => () => {};

  @PostConstruct
  doMeow(
    f: (arg: unknown) => void
  ): void {
  }
}
