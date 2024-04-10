import { Bean, ClawjectApplication, ClawjectFactory, Embedded, ExposeBeans } from '@clawject/di';

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
