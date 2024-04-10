import { Bean, ClawjectApplication, ClawjectFactory, ExposeBeans } from '@clawject/di';

describe('ClawjectFactoryTest', () => {
  it('should initialize application class with different constructor parameters shape', async() => {
    //Given
    @ClawjectApplication
    class Application {
      constructor(
        private _data: string
      ) {}

      @Bean data = () => this._data;

      exposed = ExposeBeans<{ data: string }>();
    }
    //When
    const applicationPlainArray = await ClawjectFactory.createApplicationContext(Application, ['dataPlainArray']);
    const applicationFunctionArray = await ClawjectFactory.createApplicationContext(Application, () => ['dataFunctionArray'] as [string]);
    const applicationFunctionArrayPromise = await ClawjectFactory.createApplicationContext(Application, async() => ['dataPromiseArray'] as [string]);

    //Then
    const exposedPlainArray = await applicationPlainArray.getExposedBeans();
    const exposedFunctionArray = await applicationFunctionArray.getExposedBeans();
    const exposedFunctionArrayPromise = await applicationFunctionArrayPromise.getExposedBeans();

    expect(exposedPlainArray).toEqual({ data: 'dataPlainArray' });
    expect(exposedFunctionArray).toEqual({ data: 'dataFunctionArray' });
    expect(exposedFunctionArrayPromise).toEqual({ data: 'dataPromiseArray' });
  });
});
