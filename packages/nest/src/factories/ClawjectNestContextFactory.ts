import { INestApplicationContext, Module, Scope } from '@nestjs/common';
import { BeanProcessor, ClawjectApplicationContext, ClawjectFactory } from '@clawject/di';
import { Deferred } from '../utils/Deferred';
import { DynamicModuleBuilder } from '../dynamic-module-builder/DynamicModuleBuilder';
import { NestMode } from '../types/NestMode';
import { NestFactory } from '@nestjs/core';
import { FinalizationBeanProcessor } from '../bean-processors/FinalizationBeanProcessor';

export class ClawjectNestContextFactory {
  constructor(
    private dynamicModuleBuilder: DynamicModuleBuilder,
    private deferredNestApplicationContext: Deferred<INestApplicationContext>,
    private beanProcessors: BeanProcessor[],
    private finalizationBeanProcessor: FinalizationBeanProcessor,
    private nestMode: NestMode
  ) {}

  async create<T extends INestApplicationContext>(
    module: any,
    args: any[],
  ): Promise<[ClawjectApplicationContext<any>, T]> {
    this.finalizationBeanProcessor.setCallback(async (): Promise<void> => {
      @Module({
        imports: this.dynamicModuleBuilder.getModules(),
      })
      class ClawjectNestApplicationRootModule {}

      const nestApplication = await this.createNestContext(ClawjectNestApplicationRootModule, args);

      this.deferredNestApplicationContext.resolve(nestApplication);
    });

    const clawjectFactory = ClawjectFactory
      .withScopeAlias('singleton', Scope.DEFAULT)
      .withScopeAlias('transient', Scope.TRANSIENT);

    this.beanProcessors.forEach(beanProcessor => {
      clawjectFactory.withBeanProcessor(beanProcessor);
    });

    return Promise.all([
      clawjectFactory.createApplicationContext(module),
      this.deferredNestApplicationContext.value as Promise<T>,
    ]);
  }

  private createNestContext(module: any, args: any[]): Promise<any> {
    switch (this.nestMode) {
    case 'context':
      return NestFactory.createApplicationContext(module, ...args);
    case 'application':
      return NestFactory.create(module, ...args);
    case 'microservice':
      return NestFactory.createMicroservice(module, ...args);
    }
  }
}
