import { Bean, ClawjectApplication, ClawjectFactory, ExposeBeans } from '@clawject/di';

describe('OptionalInjection', () => {

  class Foo {
    constructor(
      public stringOrUndefined: string | undefined,
      public stringOrNull: string | null,
      public stringOptional?: string,
    ) {}
  }

  it('test', async() => {
    //Given
    @ClawjectApplication
    class ApplicationContext {
      foo = Bean(Foo);

      exposed = ExposeBeans<{ foo: Foo; }>();
    }

    //When
    const applicationContext = await ClawjectFactory.createApplicationContext(ApplicationContext);

    //Then
    const fooBean = await applicationContext.getExposedBean('foo');

    expect(fooBean.stringOrUndefined).toBeUndefined();
    expect(fooBean.stringOrNull).toBeNull();
    expect(fooBean.stringOptional).toBeUndefined();
  });
});
