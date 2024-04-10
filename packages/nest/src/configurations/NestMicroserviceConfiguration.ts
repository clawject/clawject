import { Bean, Configuration, External } from '@clawject/di';
import { INestMicroservice } from '@nestjs/common';

@Configuration
export class NestMicroserviceConfiguration {
  @Bean @External nestMicroservice(): Promise<INestMicroservice> {
    throw new Error('This bean should have been processed with the NestControllerBeanProcessor, but it wasn\'t.');
  }
}
