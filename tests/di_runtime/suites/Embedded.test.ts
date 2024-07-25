import { Bean, ClawjectApplication, ClawjectFactory, Configuration, Embedded, ExposeBeans, Import, Internal } from '@clawject/di';

describe('Embedded', () => {
  it('should embed beans with different generics into application', async () => {
    //Given
    interface EmbeddedBeans<T> {
      data: T;
    }

    @ClawjectApplication
    class Application {
      @Bean @Embedded embeddedString1: EmbeddedBeans<string> = { data: 'string1' };
      @Bean @Embedded embeddedString2: EmbeddedBeans<string> = { data: 'string2' };
      @Bean @Embedded embeddedNumber1: EmbeddedBeans<number> = { data: 42 };
      @Bean @Embedded embeddedNumber2: EmbeddedBeans<number> = { data: 43 };

      exposed = ExposeBeans<{
        embeddedString1: EmbeddedBeans<string>,
        embeddedString2: EmbeddedBeans<string>,
        embeddedNumber1: EmbeddedBeans<number>,
        embeddedNumber2: EmbeddedBeans<number>,

        embeddedString1Data: string,
        embeddedString2Data: string,
        embeddedNumber1Data: number,
        embeddedNumber2Data: number,
      }>();
    }

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const exposed = await application.getExposedBeans();

    //Then
    const expected = {
      embeddedString1: {data: 'string1'},
      embeddedString2: {data: 'string2'},
      embeddedNumber1: {data: 42},
      embeddedNumber2: {data: 43},
      embeddedString1Data: 'string1',
      embeddedString2Data: 'string2',
      embeddedNumber1Data: 42,
      embeddedNumber2Data: 43,
    };

    expect(exposed).toEqual(expected);
  });

  it('should embed beans from imported configurations with different generics into application', async () => {
    //Given
    interface EmbeddedBeans<T> {
      data: T;
    }

    @Configuration
    class Foo {
      @Bean @Embedded embeddedString1: EmbeddedBeans<string> = { data: 'string1' };
    }

    @Configuration
    class Bar {
      @Bean @Embedded embeddedString2: EmbeddedBeans<string> = { data: 'string2' };
    }

    @Configuration
    class Baz {
      @Bean @Embedded embeddedNumber1: EmbeddedBeans<number> = { data: 42 };
    }

    @ClawjectApplication
    class Application {
      foo = Import(Foo);
      bar = Import(Bar);
      baz = Import(Baz);

      @Bean @Embedded embeddedNumber2: EmbeddedBeans<number> = { data: 43 };

      exposed = ExposeBeans<{
        embeddedString1: EmbeddedBeans<string>,
        embeddedString2: EmbeddedBeans<string>,
        embeddedNumber1: EmbeddedBeans<number>,
        embeddedNumber2: EmbeddedBeans<number>,

        embeddedString1Data: string,
        embeddedString2Data: string,
        embeddedNumber1Data: number,
        embeddedNumber2Data: number,
      }>();
    }

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const exposed = await application.getExposedBeans();

    //Then
    const expected = {
      embeddedString1: {data: 'string1'},
      embeddedString2: {data: 'string2'},
      embeddedNumber1: {data: 42},
      embeddedNumber2: {data: 43},
      embeddedString1Data: 'string1',
      embeddedString2Data: 'string2',
      embeddedNumber1Data: 42,
      embeddedNumber2Data: 43,
    };

    expect(exposed).toEqual(expected);
  });

  it('should embed beans with dependencies from imported configurations with different generics into application', async () => {
    //Given
    interface EmbeddedBeans<T> {
      data: T;
    }

    @Configuration
    class Foo {
      @Bean @Internal prefix = 'foo';

      @Bean @Embedded embeddedString1(prefix: string): EmbeddedBeans<string> {
        return { data: prefix + 'string1' };
      }
    }

    @Configuration
    class Bar {
      @Bean @Internal prefix = 'bar';

      @Bean @Embedded embeddedString2(prefix: string): EmbeddedBeans<string> {
        return { data: prefix + 'string2' };
      }
    }

    @Configuration
    class Baz {
      @Bean @Internal num = 1;

      @Bean @Embedded embeddedNumber1(num: number): EmbeddedBeans<number> {
        return { data: num + 41 };
      }
    }

    @ClawjectApplication
    class Application {
      foo = Import(Foo);
      bar = Import(Bar);
      baz = Import(Baz);

      @Bean @Internal num = 1;

      @Bean @Embedded embeddedNumber2(num: number): EmbeddedBeans<number> {
        return { data: num + 42 };
      }

      exposed = ExposeBeans<{
        embeddedString1: EmbeddedBeans<string>,
        embeddedString2: EmbeddedBeans<string>,
        embeddedNumber1: EmbeddedBeans<number>,
        embeddedNumber2: EmbeddedBeans<number>,

        embeddedString1Data: string,
        embeddedString2Data: string,
        embeddedNumber1Data: number,
        embeddedNumber2Data: number,
      }>();
    }

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const exposed = await application.getExposedBeans();

    //Then
    const expected = {
      embeddedString1: {data: 'foostring1'},
      embeddedString2: {data: 'barstring2'},
      embeddedNumber1: {data: 42},
      embeddedNumber2: {data: 43},
      embeddedString1Data: 'foostring1',
      embeddedString2Data: 'barstring2',
      embeddedNumber1Data: 42,
      embeddedNumber2Data: 43,
    };

    expect(exposed).toEqual(expected);
  });

  it('should ignore self embedded properties', async() => {
    //Given
    type EmbeddedBean = {
      embeddedString: string;
      nonEmbeddedString: string;
    }

    @ClawjectApplication
    class Application {
      @Bean nonEmbeddedString = 'nonEmbeddedStringValue';

      @Bean @Embedded embeddedBean(
        dep0: string
      ): EmbeddedBean {
        return { embeddedString: 'embeddedStringValue', nonEmbeddedString: dep0 };
      }

      exposed = ExposeBeans<{
        nonEmbeddedString: string,
        embeddedBeanEmbeddedString: string,
        embeddedBeanNonEmbeddedString: string,
        embeddedBean: EmbeddedBean,
      }>();
    }

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const exposed = await application.getExposedBeans();

    //Then
    const expected = {
      nonEmbeddedString: 'nonEmbeddedStringValue',
      embeddedBeanEmbeddedString: 'embeddedStringValue',
      embeddedBeanNonEmbeddedString: 'nonEmbeddedStringValue',
      embeddedBean: {
        embeddedString: 'embeddedStringValue',
        nonEmbeddedString: 'nonEmbeddedStringValue',
      },
    };

    expect(exposed).toEqual(expected);
  });
});
