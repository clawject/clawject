import { ClassConstructor } from '@clawject/di';
import { INestApplication } from '@nestjs/common';
import { IClawjectNestApplicationContext } from './IClawjectNestApplicationContext';

export interface IClawjectNestApplication<T extends ClassConstructor<any>, TServer = any> extends IClawjectNestApplicationContext<T>, INestApplication<TServer> {}
