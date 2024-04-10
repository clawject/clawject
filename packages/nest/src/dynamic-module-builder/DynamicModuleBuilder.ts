import { DynamicModule } from '@nestjs/common';
import { ClassConstructor } from '@clawject/di';
import { MODULE_METADATA } from '@nestjs/common/constants';

export class DynamicModuleBuilder {
  private store = new Map<ClassConstructor<any>, Required<DynamicModule>>();

  getModules(): Required<DynamicModule>[] {
    return Array.from(this.store.values());
  }

  getModule(module: ClassConstructor<any>): Required<DynamicModule> {
    let moduleMetadata = this.store.get(module);

    if (!moduleMetadata) {
      moduleMetadata = {
        module: module,
        controllers: Reflect.getMetadata(MODULE_METADATA.CONTROLLERS, module) ?? [],
        providers: Reflect.getMetadata(MODULE_METADATA.PROVIDERS, module) ?? [],
        imports: Reflect.getMetadata(MODULE_METADATA.IMPORTS, module) ?? [],
        exports: Reflect.getMetadata(MODULE_METADATA.EXPORTS, module) ?? [],
        global: false,
      };
      this.store.set(module, moduleMetadata);
    }

    return moduleMetadata;
  }
}
