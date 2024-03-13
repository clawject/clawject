import { Bean, ClawjectApplication, ClawjectFactory, ExposeBeans } from '@clawject/di';

describe('InjectCollections', () => {
  it('should inject array, set and map of specified types', async () => {
    //Given
    type TA = { ta: number }
    interface IA { ia: number }
    class CA { static counter = 0; ca = CA.counter++ }

    class DependencyHolder {
      constructor(
        public readonly stringsArray: string[],
        public readonly stringsSet: Set<string>,
        public readonly stringsMap: Map<string, string>,
        public readonly numbersArray: number[],
        public readonly numbersSet: Set<number>,
        public readonly numbersMap: Map<string, number>,
        public readonly booleansArray: boolean[],
        public readonly booleansSet: Set<boolean>,
        public readonly booleansMap: Map<string, boolean>,
        public readonly taArray: TA[],
        public readonly taSet: Set<TA>,
        public readonly taMap: Map<string, TA>,
        public readonly iaArray: IA[],
        public readonly iaSet: Set<IA>,
        public readonly iaMap: Map<string, IA>,
        public readonly caArray: CA[],
        public readonly caSet: Set<CA>,
        public readonly caMap: Map<string, CA>,
      ) {}
    }

    @ClawjectApplication
    class Application {
      @Bean string0 = '0';
      @Bean string1 = '1';

      @Bean number0 = 0;
      @Bean number1 = 1;

      @Bean boolean0 = false;
      @Bean boolean1 = true;

      @Bean ta0: TA = { ta: 0 };
      @Bean ta1: TA = { ta: 1 };

      @Bean ia0: IA = { ia: 0 };
      @Bean ia1: IA = { ia: 1 };

      @Bean ca0 = new CA();
      @Bean ca1 = new CA();

      dependencyHolder = Bean(DependencyHolder);


      exposed = ExposeBeans<{ dependencyHolder: DependencyHolder }>();
    }

    const expectedObject = {
      stringsArray: ['0', '1'],
      stringsSet: new Set(['0', '1']),
      stringsMap: new Map([['string0', '0'], ['string1', '1']]),
      numbersArray: [0, 1],
      numbersSet: new Set([0, 1]),
      numbersMap: new Map([['number0', 0], ['number1', 1]]),
      booleansArray: [false, true],
      booleansSet: new Set([false, true]),
      booleansMap: new Map([['boolean0', false], ['boolean1', true]]),
      taArray: [{ ta: 0 }, { ta: 1 }],
      taSet: new Set([{ ta: 0 }, { ta: 1 }]),
      taMap: new Map([['ta0', { ta: 0 }], ['ta1', { ta: 1 }]]),
      iaArray: [{ ia: 0 }, { ia: 1 }],
      iaSet: new Set([{ ia: 0 }, { ia: 1 }]),
      iaMap: new Map([['ia0', { ia: 0 }], ['ia1', { ia: 1 }]]),
      caArray: [{ ca: 0 }, { ca: 1 }],
      caSet: new Set([{ ca: 0 }, { ca: 1 }]),
      caMap: new Map([['ca0', { ca: 0 }], ['ca1', { ca: 1 }]]),
    };

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const dependencyHolder = await application.getExposedBean('dependencyHolder');

    //Then
    expect(dependencyHolder).toEqual(expectedObject);
  });
});
