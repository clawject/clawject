import { BeanProcessor, BeanProcessorFactoryMetadata, ClassConstructor } from '@clawject/di';
import { DynamicModule, INestApplicationContext } from '@nestjs/common';
import { CONTROLLER_WATERMARK, MODULE_METADATA, PARAMTYPES_METADATA } from '@nestjs/common/constants';
import { copyClass } from '../utils/copyClass';

export class NestBeanProcessor implements BeanProcessor {
  constructor(
    private readonly nestApplicationPromise: Promise<INestApplicationContext>,
    private onModulesCreated: (modules: DynamicModule[]) => void,
  ) {}

  private configurationToModuleMetadata = new Map<ClassConstructor<any>, Required<DynamicModule>>();

  processFactory(factoryMetadata: BeanProcessorFactoryMetadata): BeanProcessorFactoryMetadata['factory'] {
    if (this.isNestController(factoryMetadata.beanMetadata.resolvedConstructor)) {
      return this.processControllerBean(factoryMetadata);
    }

    return factoryMetadata.factory;
  }

  onBeansInitialized(): void {
    this.onModulesCreated(Array.from(this.configurationToModuleMetadata.values()));
  }

  private processControllerBean(factoryMetadata: BeanProcessorFactoryMetadata): BeanProcessorFactoryMetadata['factory'] {
    const moduleMetadata = this.getOrCreateModuleMetadata(factoryMetadata.beanMetadata.parentConfigurationClassConstructor);
    const resolvedConstructor = factoryMetadata.beanMetadata.resolvedConstructor!;

    const parameterTypes = Reflect.getMetadata(PARAMTYPES_METADATA, resolvedConstructor) as any[] | undefined;
    if (!parameterTypes) {
      return factoryMetadata.factory;
    }

    const classCopy = copyClass(resolvedConstructor);

    return async (...constructorParameters) => {
      const injectionTokens = new Array(parameterTypes.length);
      constructorParameters.forEach((it, index) => {
        const token = Symbol();
        injectionTokens[index] = token;
        moduleMetadata.providers.push({
          provide: token,
          useFactory: () => it,
        });
      });

      Reflect.defineMetadata(PARAMTYPES_METADATA, injectionTokens, classCopy);
      moduleMetadata.controllers.push(classCopy);

      const nestApplication = await this.nestApplicationPromise;

      return nestApplication.get(classCopy);
    };
  }

  private getOrCreateModuleMetadata(configurationClassConstructor: ClassConstructor<any>): Required<DynamicModule> {
    let moduleMetadata = this.configurationToModuleMetadata.get(configurationClassConstructor);
    if (!moduleMetadata) {
      moduleMetadata = {
        module: configurationClassConstructor,
        controllers: Reflect.getMetadata(MODULE_METADATA.CONTROLLERS, configurationClassConstructor) ?? [],
        providers: Reflect.getMetadata(MODULE_METADATA.PROVIDERS, configurationClassConstructor) ?? [],
        imports: Reflect.getMetadata(MODULE_METADATA.IMPORTS, configurationClassConstructor) ?? [],
        exports: Reflect.getMetadata(MODULE_METADATA.EXPORTS, configurationClassConstructor) ?? [],
        global: false,
      };
      this.configurationToModuleMetadata.set(configurationClassConstructor, moduleMetadata);
    }

    return moduleMetadata;
  }

  private isNestController(resolvedConstructor: ClassConstructor<any> | null): boolean {
    return resolvedConstructor !== null && Reflect.hasMetadata(CONTROLLER_WATERMARK, resolvedConstructor);
  }
}
