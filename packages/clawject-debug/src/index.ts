import {Bean, ClawjectApplication, Configuration, Import, Internal} from '@clawject/di';

@Configuration
@Internal
export class _2<T> {
  @Bean data(dep: T): T {
    return 'data' as any;
  }

  static storage = new Map<any, typeof _2<any>>();

  static forEntity<T>(entity: T): typeof _2<T> {
    let stored = _2.storage.get(entity);

    if (!stored) {
      stored = Configuration.copy(_2<T>);
      _2.storage.set(entity, stored);
    }

    return stored;
  }
}

@ClawjectApplication
export class _1 {
  imports = Import(_2.forEntity(''));

  @Bean root = 42 as const;
}
