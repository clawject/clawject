import { BeanDecorator } from './base/BeanDecorator';
import { ClawjectApplicationDecorator } from './base/ClawjectApplicationDecorator';
import { ConfigurationDecorator } from './base/ConfigurationDecorator';
import { EmbeddedDecorator } from './base/EmbeddedDecorator';
import { ExternalDecorator } from './base/ExternalDecorator';
import { InternalDecorator } from './base/InternalDecorator';
import { LazyDecorator } from './base/LazyDecorator';
import { PostConstructDecorator } from './base/PostConstructDecorator';
import { PreDestroyDecorator } from './base/PreDestroyDecorator';
import { PrimaryDecorator } from './base/PrimaryDecorator';
import { QualifierDecorator } from './base/QualifierDecorator';
import { ScopeDecorator } from './base/ScopeDecorator';

export const BaseDecorators = {
  Bean: new BeanDecorator(),
  ClawjectApplication: new ClawjectApplicationDecorator(),
  Configuration: new ConfigurationDecorator(),
  Embedded: new EmbeddedDecorator(),
  External: new ExternalDecorator(),
  Internal: new InternalDecorator(),
  Lazy: new LazyDecorator(),
  PostConstruct: new PostConstructDecorator(),
  PreDestroy: new PreDestroyDecorator(),
  Primary: new PrimaryDecorator(),
  Qualifier: new QualifierDecorator(),
  Scope: new ScopeDecorator(),
};
