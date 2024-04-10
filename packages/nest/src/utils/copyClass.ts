import { ClassConstructor } from '@clawject/di';

export const copyClass = <T extends ClassConstructor<any>>(source: T): T => {
  const obj = {
    [source.name]: class extends source {}
  } as any;

  return obj[source.name];
};
