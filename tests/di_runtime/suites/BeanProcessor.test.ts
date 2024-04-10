import { Bean, BeanProcessor, BeanProcessorFactoryMetadata, ClawjectApplication, ClawjectFactory, ExposeBeans, Scope } from '@clawject/di';
import sinon from 'sinon';

describe('BeanProcessor tests', () => {
  it('should alter bean factories, and call onBeansInitialized method when everything is initialized', async() => {
    //Given
    class FooDependency {
      static instantiationCounter = 0;

      constructor(
        public instantiatedBy: 'container' | 'own' | 'processor'
      ) {
        FooDependency.instantiationCounter++;
      }
    }
    class BarDependency {
      static instantiationCounter = 0;

      constructor(
        public instantiatedBy: 'container' | 'own' | 'processor'
      ) {
        BarDependency.instantiationCounter++;
      }
    }

    class A {
      constructor(
        public foo: FooDependency,
        public bar: BarDependency,
      ) {}

      prop = 'A';
    }
    class B {
      constructor(
        public foo: FooDependency,
        public bar: BarDependency,
      ) {}

      prop = 'B';
    }

    @ClawjectApplication
    class Application {
      @Bean instantiatedBy = 'container' as const;

      foo = Bean(FooDependency);
      bar = Bean(BarDependency);

      @Bean aProperty = new A(new FooDependency('own'), new BarDependency('own'));
      @Bean @Scope('transient') aFactoryMethod(foo: FooDependency, bar: BarDependency) { return new A(foo, bar); }
      @Bean aFactoryArrowFunction = (foo: FooDependency, bar: BarDependency) => new A(foo, bar);
      @Scope('transient') a = Bean(A);

      exposed = ExposeBeans<{
        aProperty: A;
        aFactoryMethod: A;
        aFactoryArrowFunction: A;
        a: A;
      }>();
    }

    const beanMetadataSpy = sinon.spy();
    const beanDependenciesSpy = sinon.spy();
    const onBeansInitializedSpy = sinon.spy();

    class MyBeanProcessor implements BeanProcessor {
      private propertiesToAlter: (keyof Application | string)[] = ['aProperty', 'aFactoryMethod', 'aFactoryArrowFunction', 'a'];

      processFactory(factoryMetadata: BeanProcessorFactoryMetadata): BeanProcessorFactoryMetadata['factory'] {
        if (this.propertiesToAlter.includes(factoryMetadata.beanMetadata.classPropertyName)) {
          beanMetadataSpy(factoryMetadata);
          return (...args: any[]) => {
            beanDependenciesSpy(factoryMetadata.beanMetadata.classPropertyName, args);
            return new B(args[0] ?? new FooDependency('processor'), args[1] ?? new BarDependency('processor'));
          };
        }

        return factoryMetadata.factory;
      }

      onBeansInitialized() {
        onBeansInitializedSpy();
      }
    }

    //When
    const app = await ClawjectFactory
      .withBeanProcessor(new MyBeanProcessor())
      .createApplicationContext(Application);

    //Then
    const exposed = await app.getExposedBeans();

    expect(FooDependency.instantiationCounter).toBe(3);
    expect(BarDependency.instantiationCounter).toBe(3);

    expect(exposed.aProperty).toBeInstanceOf(B);
    expect(exposed.aProperty.prop).toBe('B');
    expect(exposed.aProperty.foo).toBeInstanceOf(FooDependency);
    expect(exposed.aProperty.foo.instantiatedBy).toBe('processor');
    expect(exposed.aProperty.bar).toBeInstanceOf(BarDependency);
    expect(exposed.aProperty.bar.instantiatedBy).toBe('processor');

    expect(exposed.aFactoryMethod).toBeInstanceOf(B);
    expect(exposed.aFactoryMethod.prop).toBe('B');
    expect(exposed.aFactoryMethod.foo).toBeInstanceOf(FooDependency);
    expect(exposed.aFactoryMethod.foo.instantiatedBy).toBe('container');
    expect(exposed.aFactoryMethod.bar).toBeInstanceOf(BarDependency);
    expect(exposed.aFactoryMethod.bar.instantiatedBy).toBe('container');

    expect(exposed.aFactoryArrowFunction).toBeInstanceOf(B);
    expect(exposed.aFactoryArrowFunction.prop).toBe('B');
    expect(exposed.aFactoryArrowFunction.foo).toBeInstanceOf(FooDependency);
    expect(exposed.aFactoryArrowFunction.foo.instantiatedBy).toBe('container');
    expect(exposed.aFactoryArrowFunction.bar).toBeInstanceOf(BarDependency);
    expect(exposed.aFactoryArrowFunction.bar.instantiatedBy).toBe('container');

    expect(exposed.a).toBeInstanceOf(B);
    expect(exposed.a.prop).toBe('B');
    expect(exposed.a.foo).toBeInstanceOf(FooDependency);
    expect(exposed.a.foo.instantiatedBy).toBe('container');
    expect(exposed.a.bar).toBeInstanceOf(BarDependency);
    expect(exposed.a.bar.instantiatedBy).toBe('container');

    expect(beanMetadataSpy.callCount).toBe(4);

    expect(beanMetadataSpy.getCall(0).args[0].beanMetadata.parentConfigurationClassConstructor).toBe(Application);
    expect(beanMetadataSpy.getCall(0).args[0].beanMetadata.parentConfigurationInstance).toBeInstanceOf(Application);
    expect(beanMetadataSpy.getCall(0).args[0].beanMetadata.name).toBe('0_3_aProperty');
    expect(beanMetadataSpy.getCall(0).args[0].beanMetadata.classPropertyName).toBe('aProperty');
    expect(beanMetadataSpy.getCall(0).args[0].beanMetadata.scope).toBe('singleton');
    expect(beanMetadataSpy.getCall(0).args[0].beanMetadata.resolvedConstructor).toBe(null);
    expect(beanMetadataSpy.getCall(0).args[0].factory).toBeInstanceOf(Function);

    expect(beanMetadataSpy.getCall(1).args[0].beanMetadata.parentConfigurationClassConstructor).toBe(Application);
    expect(beanMetadataSpy.getCall(1).args[0].beanMetadata.parentConfigurationInstance).toBeInstanceOf(Application);
    expect(beanMetadataSpy.getCall(1).args[0].beanMetadata.name).toBe('0_4_aFactoryMethod');
    expect(beanMetadataSpy.getCall(1).args[0].beanMetadata.classPropertyName).toBe('aFactoryMethod');
    expect(beanMetadataSpy.getCall(1).args[0].beanMetadata.scope).toBe('transient');
    expect(beanMetadataSpy.getCall(1).args[0].beanMetadata.resolvedConstructor).toBe(null);
    expect(beanMetadataSpy.getCall(1).args[0].factory).toBeInstanceOf(Function);

    expect(beanMetadataSpy.getCall(2).args[0].beanMetadata.parentConfigurationClassConstructor).toBe(Application);
    expect(beanMetadataSpy.getCall(2).args[0].beanMetadata.parentConfigurationInstance).toBeInstanceOf(Application);
    expect(beanMetadataSpy.getCall(2).args[0].beanMetadata.name).toBe('0_5_aFactoryArrowFunction');
    expect(beanMetadataSpy.getCall(2).args[0].beanMetadata.classPropertyName).toBe('aFactoryArrowFunction');
    expect(beanMetadataSpy.getCall(2).args[0].beanMetadata.scope).toBe('singleton');
    expect(beanMetadataSpy.getCall(2).args[0].beanMetadata.resolvedConstructor).toBe(null);
    expect(beanMetadataSpy.getCall(2).args[0].factory).toBeInstanceOf(Function);

    expect(beanMetadataSpy.getCall(3).args[0].beanMetadata.parentConfigurationClassConstructor).toBe(Application);
    expect(beanMetadataSpy.getCall(3).args[0].beanMetadata.parentConfigurationInstance).toBeInstanceOf(Application);
    expect(beanMetadataSpy.getCall(3).args[0].beanMetadata.name).toBe('0_6_a');
    expect(beanMetadataSpy.getCall(3).args[0].beanMetadata.classPropertyName).toBe('a');
    expect(beanMetadataSpy.getCall(3).args[0].beanMetadata.scope).toBe('transient');
    expect(beanMetadataSpy.getCall(3).args[0].beanMetadata.resolvedConstructor).toBe(A);
    expect(beanMetadataSpy.getCall(3).args[0].factory).toBeInstanceOf(Function);

    expect(beanDependenciesSpy.callCount).toBe(4);
    expect(beanDependenciesSpy.calledAfter(beanMetadataSpy)).toBe(true);

    expect(beanDependenciesSpy.getCall(0).args[0]).toBe('aProperty');
    expect(beanDependenciesSpy.getCall(0).args[1][0]).toBe(undefined);
    expect(beanDependenciesSpy.getCall(0).args[1][1]).toBe(undefined);

    expect(beanDependenciesSpy.getCall(1).args[0]).toBe('aFactoryArrowFunction');
    expect((beanDependenciesSpy.getCall(1).args[1][0] as FooDependency).instantiatedBy).toBe('container');
    expect((beanDependenciesSpy.getCall(1).args[1][1] as BarDependency).instantiatedBy).toBe('container');

    expect(beanDependenciesSpy.getCall(2).args[0]).toBe('aFactoryMethod');
    expect((beanDependenciesSpy.getCall(2).args[1][0] as FooDependency).instantiatedBy).toBe('container');
    expect((beanDependenciesSpy.getCall(2).args[1][1] as BarDependency).instantiatedBy).toBe('container');

    expect(beanDependenciesSpy.getCall(3).args[0]).toBe('a');
    expect((beanDependenciesSpy.getCall(3).args[1][0] as FooDependency).instantiatedBy).toBe('container');
    expect((beanDependenciesSpy.getCall(3).args[1][1] as BarDependency).instantiatedBy).toBe('container');

    expect(onBeansInitializedSpy.callCount).toBe(1);
    expect(onBeansInitializedSpy.calledAfter(beanMetadataSpy)).toBe(true);
    expect(onBeansInitializedSpy.calledBefore(beanDependenciesSpy)).toBe(true);
  });
});
