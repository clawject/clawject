import { AbstractBeanProcessor } from './AbstractBeanProcessor';
import { BeanProcessorFactoryMetadata } from '@clawject/di';
import { NestConfiguration } from '../configurations/NestConfiguration';
import { INestApplicationContext } from '@nestjs/common';
import { Deferred } from '../utils/Deferred';

export class NestApplicationContextBeanProcessor extends AbstractBeanProcessor {
  constructor(
    private readonly nestApplicationDeferred: Deferred<INestApplicationContext>
  ) {super();}

  processFactory(factoryMetadata: BeanProcessorFactoryMetadata): BeanProcessorFactoryMetadata['factory'] {
    if (this.isDesiredBean(factoryMetadata, NestConfiguration, 'nestApplicationContext')) {
      return () => this.nestApplicationDeferred.value;
    }

    return factoryMetadata.factory;
  }
}
