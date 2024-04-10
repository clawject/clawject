import { AbstractBeanProcessor } from './AbstractBeanProcessor';
import { BeanProcessorFactoryMetadata } from '@clawject/di';
import { INestApplicationContext } from '@nestjs/common';
import { Deferred } from '../utils/Deferred';
import { NestMode } from '../types/NestMode';
import { NestApplicationConfiguration } from '../configurations/NestApplicationConfiguration';

export class NestApplicationBeanProcessor extends AbstractBeanProcessor {
  constructor(
    private readonly nestApplicationDeferred: Deferred<INestApplicationContext>,
    private nestMode: NestMode
  ) {super();}

  processFactory(factoryMetadata: BeanProcessorFactoryMetadata): BeanProcessorFactoryMetadata['factory'] {
    if (this.isDesiredBean(factoryMetadata, NestApplicationConfiguration, 'nestApplication')) {
      if (this.nestMode !== 'application') {
        throw new Error('The "NestApplicationConfiguration" should only be used only in application mode.');
      }

      return () => this.nestApplicationDeferred.value;
    }

    return factoryMetadata.factory;
  }
}
