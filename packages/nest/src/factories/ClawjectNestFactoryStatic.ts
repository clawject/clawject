import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';
import { ClassConstructor, ClawjectApplicationContext, ClawjectFactory } from '@clawject/di';
import { INestApplicationContext } from '@nestjs/common';
import { NestApplicationOptions } from '@nestjs/common/interfaces/nest-application-options.interface';
import { AbstractHttpAdapter } from '@nestjs/core/adapters/http-adapter';
import { NestMicroserviceOptions } from '@nestjs/common/interfaces/microservices/nest-microservice-options.interface';
import { IClawjectNestApplication } from '../interfaces/IClawjectNestApplication';
import { IClawjectNestMicroservice } from '../interfaces/IClawjectNestMicroservice';
import { IClawjectNestApplicationContext } from '../interfaces/IClawjectNestApplicationContext';
import { NestMode } from '../types/NestMode';
import { ClawjectNestApplication } from '../config/ClawjectNestApplication';

const ClawjectContextKeys: (keyof Omit<ClawjectApplicationContext<any>, 'destroy'>)[] = [
  'getExposedBean',
  'getExposedBeans',
];

class ClawjectNestFactoryStatic {
  /**
   * Creates an instance of ClawjectNestApplication.
   *
   * @param module Entry (root) application module class
   * @param options List of options to initialize NestApplication
   *
   * @returns A promise that, when resolved,
   * contains a reference to the ClawjectNestApplication instance.
   */
  create<T extends ClassConstructor<any, []>>(module: any, options?: NestApplicationOptions): Promise<IClawjectNestApplication<T>>;
  /**
   * Creates an instance of ClawjectNestApplication with the specified `httpAdapter`.
   *
   * @param moduleCls Entry (root) application moduleCls class
   * @param httpAdapter Adapter to proxy the request/response cycle to
   *    the underlying HTTP server
   * @param options List of options to initialize NestApplication
   *
   * @returns A promise that, when resolved,
   * contains a reference to the ClawjectNestApplication instance.
   */
  create<T extends ClassConstructor<any, []>>(moduleCls: any, httpAdapter: AbstractHttpAdapter, options?: NestApplicationOptions): Promise<IClawjectNestApplication<T>>;
  async create<T extends ClassConstructor<any, []>>(moduleCls: any, ...rest: any[]): Promise<IClawjectNestApplication<T>> {
    return this.build<IClawjectNestApplication<T>>(moduleCls, rest, 'application');
  }

  /**
   * Creates an instance of ClawjectNestMicroservice.
   *
   * @param moduleCls Entry (root) application module class
   * @param options Optional microservice configuration
   *
   * @returns A promise that, when resolved,
   * contains a reference to the ClawjectNestMicroservice instance.
   */
  async createMicroservice<T extends ClassConstructor<any, []>, O extends object>(moduleCls: any, options?: NestMicroserviceOptions & O): Promise<IClawjectNestMicroservice<T>>
  async createMicroservice<T extends ClassConstructor<any, []>>(moduleCls: any, ...rest: []): Promise<IClawjectNestMicroservice<T>> {
    return this.build<IClawjectNestMicroservice<T>>(moduleCls, rest, 'microservice');
  }

  /**
   * Creates an instance of ClawjectNestApplicationContext.
   *
   * @param moduleCls Entry (root) application module class
   * @param options Optional Nest application configuration
   *
   * @returns A promise that, when resolved,
   * contains a reference to the ClawjectNestApplicationContext instance.
   */
  async createApplicationContext<T extends ClassConstructor<any, []>>(moduleCls: T, options?: NestApplicationContextOptions): Promise<IClawjectNestApplicationContext<T>>
  async createApplicationContext<T extends ClassConstructor<any, []>>(moduleCls: T, ...rest: any[]): Promise<IClawjectNestApplicationContext<T>> {
    return this.build<IClawjectNestApplicationContext<T>>(moduleCls, rest, 'context');
  }

  private async build<T>(module: any, args: any[], mode: NestMode): Promise<T> {
    const application = await ClawjectFactory.createApplicationContext(ClawjectNestApplication, [mode]);
    const nestContextFactory = await application.getExposedBean('clawjectNestContextFactory');

    const [clawject, nest] = await nestContextFactory.create(module, args);

    return this.createClawjectNest(clawject, nest);
  }

  private createClawjectNest(
    clawjectApplicationContext: ClawjectApplicationContext<any>,
    nestApplicationContext: INestApplicationContext,
  ): any {
    ClawjectContextKeys.forEach(key => {
      Object.defineProperty(nestApplicationContext, key, {
        value: clawjectApplicationContext[key].bind(clawjectApplicationContext),
      });
    });

    return nestApplicationContext;
  }
}

export const ClawjectNestFactory = new ClawjectNestFactoryStatic();
