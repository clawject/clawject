import { Bean, ClawjectApplication, ExposeBeans } from '@clawject/di';
import { DynamicModuleBuilder } from '../dynamic-module-builder/DynamicModuleBuilder';
import { NestMode } from '../types/NestMode';
import { NestApplicationBeanProcessor } from '../bean-processors/NestApplicationBeanProcessor';
import { Deferred } from '../utils/Deferred';
import { INestApplicationContext } from '@nestjs/common';
import { NestApplicationContextBeanProcessor } from '../bean-processors/NestApplicationContextBeanProcessor';
import { NestMicroserviceBeanProcessor } from '../bean-processors/NestMicroserviceBeanProcessor';
import { ClawjectNestContextFactory } from '../factories/ClawjectNestContextFactory';
import { FinalizationBeanProcessor } from '../bean-processors/FinalizationBeanProcessor';
import { NestControllerBeanProcessor } from '../bean-processors/NestControllerBeanProcessor';

@ClawjectApplication
export class ClawjectNestApplication {
  constructor(
    private _nestMode: NestMode,
  ) {}

  @Bean nestMode(): NestMode {
    return this._nestMode;
  }

  @Bean deferredNestApplication = Bean(Deferred<INestApplicationContext>);

  dynamicModuleBuilder = Bean(DynamicModuleBuilder);

  nestApplicationBeanProcessor = Bean(NestApplicationBeanProcessor);
  nestApplicationContextBeanProcessor = Bean(NestApplicationContextBeanProcessor);
  nestMicroserviceBeanProcessor = Bean(NestMicroserviceBeanProcessor);
  nestControllerBeanProcessor = Bean(NestControllerBeanProcessor);
  finalizationBeanProcessor = Bean(FinalizationBeanProcessor);

  clawjectNestContextFactory = Bean(ClawjectNestContextFactory);

  exposed = ExposeBeans<{
    clawjectNestContextFactory: ClawjectNestContextFactory,
  }>();
}
