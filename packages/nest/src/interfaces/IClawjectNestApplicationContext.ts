import { ClassConstructor, ClawjectApplicationContext } from '@clawject/di';
import { INestApplicationContext } from '@nestjs/common';

export interface IClawjectNestApplicationContext<T extends ClassConstructor<any>> extends INestApplicationContext, Omit<ClawjectApplicationContext<T>, 'destroy'> {}
