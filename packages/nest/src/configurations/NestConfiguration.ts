import { Bean, Configuration, External } from '@clawject/di';
import { INestApplicationContext } from '@nestjs/common';

@Configuration
export class NestConfiguration {
  @Bean @External nestApplicationContext(): Promise<INestApplicationContext> {
    throw new Error('This bean should have been processed with the NestControllerBeanProcessor, but it wasn\'t.');
  }
}

