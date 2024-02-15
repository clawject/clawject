import {Bean, ClawjectApplication, ClawjectFactory, PreDestroy} from '@clawject/di';

class Foo {
  @PreDestroy
  destroy() {
    console.log('destroy foo');
  }
}

@ClawjectApplication
class Application {
  foo = Bean(Foo);

  @PreDestroy
  destroy() {
    console.log('destroy application');
  }
}

const application = await ClawjectFactory.createApplicationContext(Application);
await application.close();
// prints: 'destroy foo'
// prints: 'destroy application'
