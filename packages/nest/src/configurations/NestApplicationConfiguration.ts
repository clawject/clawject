import { Bean, Configuration, External } from '@clawject/di';
import { INestApplication } from '@nestjs/common';

@Configuration
export class NestApplicationConfiguration {
  @Bean @External nestApplication(): Promise<INestApplication> {
    throw new Error('This bean should have been processed with the NestControllerBeanProcessor, but it wasn\'t.');
  }
}
