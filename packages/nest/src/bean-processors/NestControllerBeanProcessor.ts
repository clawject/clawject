import { BeanProcessor, BeanProcessorFactoryMetadata, ClassConstructor } from '@clawject/di';
import { DynamicModuleBuilder } from '../dynamic-module-builder/DynamicModuleBuilder';
import { CONTROLLER_WATERMARK, PARAMTYPES_METADATA } from '@nestjs/common/constants';
import { copyClass } from '../utils/copyClass';
import { Deferred } from '../utils/Deferred';
import { INestApplicationContext } from '@nestjs/common';

export class NestControllerBeanProcessor implements BeanProcessor {
  constructor(
    private nestApplicationContext: Deferred<INestApplicationContext>,
    private dynamicModuleBuilder: DynamicModuleBuilder
  ) {}

  processFactory(factoryMetadata: BeanProcessorFactoryMetadata): BeanProcessorFactoryMetadata['factory'] {
    if (this.isNestController(factoryMetadata.beanMetadata.resolvedConstructor)) {
      return this.process(factoryMetadata);
    }

    return factoryMetadata.factory;
  }

  private process(factoryMetadata: BeanProcessorFactoryMetadata): BeanProcessorFactoryMetadata['factory'] {
    const moduleMetadata = this.dynamicModuleBuilder.getModule(factoryMetadata.beanMetadata.parentConfigurationClassConstructor);
    const resolvedConstructor = factoryMetadata.beanMetadata.resolvedConstructor!;

    const classCopy = copyClass(resolvedConstructor);

    const parameterTypes = (Reflect.getMetadata(PARAMTYPES_METADATA, resolvedConstructor) || []) as any[];
    const dependencyPromiseResolvers = new Array(parameterTypes.length);
    const promises = parameterTypes.map((_, index) => {
      return new Promise(resolve => {
        dependencyPromiseResolvers[index] = resolve;
      });
    });
    const injectionTokens = new Array(parameterTypes.length);
    parameterTypes.forEach((_, index) => {
      const injectionToken = Symbol(index);

      injectionTokens[index] = injectionToken;
      moduleMetadata.providers.push({
        provide: injectionToken,
        useValue: promises[index]
      });
    });

    Reflect.defineMetadata(PARAMTYPES_METADATA, injectionTokens, classCopy);
    moduleMetadata.controllers.push(classCopy);

    return async (...constructorParameters) => {
      constructorParameters.forEach((it, index) => {
        dependencyPromiseResolvers[index](it);
      });

      const nestApplication = await this.nestApplicationContext.value;

      return nestApplication.get(classCopy);
    };
  }

  private isNestController(resolvedConstructor: ClassConstructor<any> | null): boolean {
    return resolvedConstructor !== null && Reflect.hasMetadata(CONTROLLER_WATERMARK, resolvedConstructor);
  }
}
