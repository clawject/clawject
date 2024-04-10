import { ClassConstructor } from '@clawject/di';
import { INestMicroservice } from '@nestjs/common';
import { IClawjectNestApplicationContext } from './IClawjectNestApplicationContext';

export interface IClawjectNestMicroservice<T extends ClassConstructor<any>> extends IClawjectNestApplicationContext<T>, INestMicroservice {}
