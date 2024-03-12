import { Bean, ClawjectApplication, ExposeBeans, PostConstruct, PreDestroy, Primary } from '@clawject/di';

type TA = { ta: boolean, counterA: number };
type TB = { tb: boolean, counterB: number } & TA;
type TC = { tc: boolean, counterC: number } & TB;
interface IA { ia: boolean, counterA: number }
interface IB { ib: boolean, counterB: number }
interface IC extends IA, IB { ic: boolean, counterC: number }

class CA {
  private static counterA = 0;
  ca = true;
  counterA = CA.counterA++;
}
class CB extends CA {
  private static counterB = 0;
  cb = true;
  counterB = CB.counterB++;
}
class CC extends CB {
  private static counterC = 0;
  cc = true;
  counterC = CC.counterC++;
}
class DependencyHolder {
  constructor(
    public readonly ta: TA,
    public readonly tb: TB,
    public readonly tb_ta: TB & TA,
    public readonly tc: TC,
    public readonly tc_tb: TC & TB,
    public readonly tc_ta: TC & TA,
    public readonly tc_tb_ta: TC & TB & TA,

    public readonly ia: IA,
    public readonly ib: IB,
    public readonly ib_ia: IB & IA,
    public readonly ic: IC,
    public readonly ic_ib: IC & IB,
    public readonly ic_ia: IC & IA,
    public readonly ic_ib_ia: IC & IB & IA,

    public readonly ca: CA,
    public readonly cb: CB,
    public readonly cb_ca: CB & CA,
    public readonly cc: CC,
    public readonly cc_cb: CC & CB,
    public readonly cc_ca: CC & CA,
    public readonly cc_cb_ca: CC & CB & CA,
  ) {}
}
@ClawjectApplication
class Application {
  @Bean @Primary tcObjectProperty: TC = { tc: true, counterC: 0, tb: true, counterB: 0, ta: true, counterA: 0 };
  @Bean tcObjectMethod(): TC { return { tc: true, counterC: 1, tb: true, counterB: 1, ta: true, counterA: 1 }; }
  @Bean tcObjectArrowFunction = (): TC => ({ tc: true, counterC: 2, tb: true, counterB: 2, ta: true, counterA: 2 });

  @Bean @Primary icObjectProperty: IC = { ic: true, counterC: 0, ib: true, counterB: 0, ia: true, counterA: 0 };
  @Bean icObjectMethod(): IC { return { ic: true, counterC: 1, ib: true, counterB: 1, ia: true, counterA: 1 }; }
  @Bean icObjectArrowFunction = (): IC => ({ ic: true, counterC: 2, ib: true, counterB: 2, ia: true, counterA: 2 });

  @Bean @Primary ccObjectProperty = new CC();
  @Bean ccObjectMethod(): CC { return new CC(); }
  @Bean ccObjectArrowFunction = () => new CC();

  dependencyHolder = Bean(DependencyHolder);

  exposed = ExposeBeans<{ dependencyHolder: DependencyHolder }>();
}
