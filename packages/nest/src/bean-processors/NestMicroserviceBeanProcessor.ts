import { AbstractBeanProcessor } from './AbstractBeanProcessor';
import { BeanProcessorFactoryMetadata } from '@clawject/di';
import { INestApplicationContext } from '@nestjs/common';
import { Deferred } from '../utils/Deferred';
import { NestMicroserviceConfiguration } from '../configurations/NestMicroserviceConfiguration';
import { NestMode } from '../types/NestMode';

export class NestMicroserviceBeanProcessor extends AbstractBeanProcessor {
  constructor(
    private readonly nestApplicationDeferred: Deferred<INestApplicationContext>,
    private nestMode: NestMode
  ) {
    super();
  }

  processFactory(factoryMetadata: BeanProcessorFactoryMetadata): BeanProcessorFactoryMetadata['factory'] {
    if (this.isDesiredBean(factoryMetadata, NestMicroserviceConfiguration, 'nestMicroservice')) {
      if (this.nestMode !== 'microservice') {
        throw new Error('The "NestApplicationConfiguration" should only be used only in application mode.');
      }

      return () => this.nestApplicationDeferred.value;
    }

    return factoryMetadata.factory;
  }
}
