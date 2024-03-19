import { Bean, ClawjectApplication, ClawjectFactory, Embedded, ExposeBeans } from '@clawject/di';

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
    embeddedBeanEmbeddedString: string,
    embeddedBeanNonEmbeddedString: string,
    nonEmbeddedString: string,
    embeddedBean: EmbeddedBean,
  }>();
}

const application = await ClawjectFactory.createApplicationContext(Application);
const exposed = await application.getExposedBeans();

console.log(exposed);
