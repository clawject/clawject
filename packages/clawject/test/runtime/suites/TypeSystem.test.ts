import sinon from 'sinon';
import { Bean, ClawjectApplication, ClawjectFactory, ExposeBeans, PostConstruct, PreDestroy } from '@clawject/di';

describe('TypeSystem', () => {
  it('should work with strings', async() => {
    //Given
    const postConstructSpy = sinon.spy();
    const preDestroySpy = sinon.spy();
    class DependencyHolder {
      constructor(
        public readonly stringProperty: string,
        public readonly stringFactoryMethod: string,
        public readonly stringFactoryArrowFunction: string,
        public readonly literal0: 'stringLiteralProperty',
        public readonly literal1: 'stringLiteralFactoryMethod',
        public readonly literal2: 'stringLiteralFactoryArrowFunction',
      ) {}
    }
    @ClawjectApplication
    class Application {
      @Bean stringProperty = 'stringProperty';
      @Bean stringFactoryMethod() { return 'stringFactoryMethod'; }
      @Bean stringFactoryArrowFunction = () => 'stringFactoryArrowFunction';

      @Bean stringLiteralProperty = 'stringLiteralProperty' as const;
      @Bean stringLiteralFactoryMethod() { return 'stringLiteralFactoryMethod' as const; }
      @Bean stringLiteralFactoryArrowFunction = () => 'stringLiteralFactoryArrowFunction' as const;

      dependencyHolder = Bean(DependencyHolder);

      @PostConstruct
      postConstruct(
        stringProperty: string,
        stringFactoryMethod: string,
        stringFactoryArrowFunction: string,
        literal0: 'stringLiteralProperty',
        literal1: 'stringLiteralFactoryMethod',
        literal2: 'stringLiteralFactoryArrowFunction',
      ) {
        postConstructSpy({
          stringProperty,
          stringFactoryMethod,
          stringFactoryArrowFunction,
          literal0,
          literal1,
          literal2,
        });
      }

      @PreDestroy
      preDestroy(
        stringProperty: string,
        stringFactoryMethod: string,
        stringFactoryArrowFunction: string,
        literal0: 'stringLiteralProperty',
        literal1: 'stringLiteralFactoryMethod',
        literal2: 'stringLiteralFactoryArrowFunction',
      ) {
        preDestroySpy({
          stringProperty,
          stringFactoryMethod,
          stringFactoryArrowFunction,
          literal0,
          literal1,
          literal2,
        });
      }

      exposed = ExposeBeans<{ dependencyHolder: DependencyHolder }>()
    }

    const expectedObject = {
      stringProperty: 'stringProperty',
      stringFactoryMethod: 'stringFactoryMethod',
      stringFactoryArrowFunction: 'stringFactoryArrowFunction',
      literal0: 'stringLiteralProperty',
      literal1: 'stringLiteralFactoryMethod',
      literal2: 'stringLiteralFactoryArrowFunction',
    };

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const dependencyHolder = await application.getExposedBean('dependencyHolder');

    //Then
    expect(postConstructSpy.calledOnceWithExactly(expectedObject)).toBe(true)
    expect(preDestroySpy.notCalled).toBe(true);

    expect(dependencyHolder).toEqual(expectedObject);

    await application.close();

    expect(postConstructSpy.calledOnce).toBe(true);
    expect(preDestroySpy.calledOnceWithExactly(expectedObject)).toBe(true);
  });

  it('should work with numbers', async() => {
    //Given
    const postConstructSpy = sinon.spy();
    const preDestroySpy = sinon.spy();
    class DependencyHolder {
      constructor(
        public readonly numberProperty: number,
        public readonly numberFactoryMethod: number,
        public readonly numberFactoryArrowFunction: number,
        public readonly literal0: 42,
        public readonly literal1: 43,
        public readonly literal2: 44,
      ) {}
    }
    @ClawjectApplication
    class Application {
      @Bean numberProperty = 1;
      @Bean numberFactoryMethod() { return 2; }
      @Bean numberFactoryArrowFunction = () => 3;

      @Bean numberLiteralProperty = 42 as const;
      @Bean numberLiteralFactoryMethod() { return 43 as const; }
      @Bean numberLiteralFactoryArrowFunction = () => 44 as const;

      dependencyHolder = Bean(DependencyHolder);

      @PostConstruct
      postConstruct(
        numberProperty: number,
        numberFactoryMethod: number,
        numberFactoryArrowFunction: number,
        literal0: 42,
        literal1: 43,
        literal2: 44,
      ) {
        postConstructSpy({
          numberProperty,
          numberFactoryMethod,
          numberFactoryArrowFunction,
          literal0,
          literal1,
          literal2,
        });
      }

      @PreDestroy
      preDestroy(
        numberProperty: number,
        numberFactoryMethod: number,
        numberFactoryArrowFunction: number,
        literal0: 42,
        literal1: 43,
        literal2: 44,
      ) {
        preDestroySpy({
          numberProperty,
          numberFactoryMethod,
          numberFactoryArrowFunction,
          literal0,
          literal1,
          literal2,
        });
      }

      exposed = ExposeBeans<{ dependencyHolder: DependencyHolder }>()
    }

    const expectedObject = {
      numberProperty: 1,
      numberFactoryMethod: 2,
      numberFactoryArrowFunction: 3,
      literal0: 42,
      literal1: 43,
      literal2: 44,
    }

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const dependencyHolder = await application.getExposedBean('dependencyHolder');

    //Then
    expect(postConstructSpy.calledOnceWithExactly(expectedObject)).toBe(true)
    expect(preDestroySpy.notCalled).toBe(true);

    expect(dependencyHolder).toEqual(expectedObject);

    await application.close();

    expect(postConstructSpy.calledOnce).toBe(true);
    expect(preDestroySpy.calledOnceWithExactly(expectedObject)).toBe(true);
  });

  it('should work with big integers', async() => {
    //Given
    const postConstructSpy = sinon.spy();
    const preDestroySpy = sinon.spy();
    class DependencyHolder {
      constructor(
        public readonly bigintProperty: bigint,
        public readonly bigintFactoryMethod: bigint,
        public readonly bigintFactoryArrowFunction: bigint,
        public readonly literal0: 42n,
        public readonly literal1: 43n,
        public readonly literal2: 44n,
      ) {}
    }
    @ClawjectApplication
    class Application {
      @Bean bigintProperty = 1n;
      @Bean bigintFactoryMethod() { return 2n; }
      @Bean bigintFactoryArrowFunction = () => 3n;

      @Bean bigintLiteralProperty = 42n as const;
      @Bean bigintLiteralFactoryMethod() { return 43n as const; }
      @Bean bigintLiteralFactoryArrowFunction = () => 44n as const;

      dependencyHolder = Bean(DependencyHolder);

      @PostConstruct
      postConstruct(
        bigintProperty: bigint,
        bigintFactoryMethod: bigint,
        bigintFactoryArrowFunction: bigint,
        literal0: 42n,
        literal1: 43n,
        literal2: 44n,
      ) {
        postConstructSpy({
          bigintProperty,
          bigintFactoryMethod,
          bigintFactoryArrowFunction,
          literal0,
          literal1,
          literal2,
        });
      }

      @PreDestroy
      preDestroy(
        bigintProperty: bigint,
        bigintFactoryMethod: bigint,
        bigintFactoryArrowFunction: bigint,
        literal0: 42n,
        literal1: 43n,
        literal2: 44n,
      ) {
        preDestroySpy({
          bigintProperty,
          bigintFactoryMethod,
          bigintFactoryArrowFunction,
          literal0,
          literal1,
          literal2,
        });
      }

      exposed = ExposeBeans<{ dependencyHolder: DependencyHolder }>()
    }

    const expectedObject = {
      bigintProperty: 1n,
      bigintFactoryMethod: 2n,
      bigintFactoryArrowFunction: 3n,
      literal0: 42n,
      literal1: 43n,
      literal2: 44n,
    }

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const dependencyHolder = await application.getExposedBean('dependencyHolder');

    //Then
    expect(postConstructSpy.calledOnceWithExactly(expectedObject)).toBe(true)
    expect(preDestroySpy.notCalled).toBe(true);

    expect(dependencyHolder).toEqual(expectedObject);

    await application.close();

    expect(postConstructSpy.calledOnce).toBe(true);
    expect(preDestroySpy.calledOnceWithExactly(expectedObject)).toBe(true);
  });

  it('should work with enums', async() => {
    //Given
    enum StringEnum {
      A = 'A',
      B = 'B',
    }
    enum NumberEnum {
      A = 1,
      B = 2,
    }

    const postConstructSpy = sinon.spy();
    const preDestroySpy = sinon.spy();
    class DependencyHolder {
      constructor(
        public readonly enumStringAProperty: StringEnum.A,
        public readonly enumStringAMethod: StringEnum.A,
        public readonly enumStringAArrowFunction: StringEnum.A,
        public readonly enumStringBProperty: StringEnum.B,
        public readonly enumStringBMethod: StringEnum.B,
        public readonly enumStringArrowFunction: StringEnum.B,

        public readonly enumNumberAProperty: NumberEnum.A,
        public readonly enumNumberAMethod: NumberEnum.A,
        public readonly enumNumberAArrowFunction: NumberEnum.A,
        public readonly enumNumberBProperty: NumberEnum.B,
        public readonly enumNumberBMethod: NumberEnum.B,
        public readonly enumNumberArrowFunction: NumberEnum.B,
      ) {}
    }

    @ClawjectApplication
    class Application {
      @Bean enumStringAProperty = StringEnum.A as const;
      @Bean enumStringAMethod() { return StringEnum.A as const; }
      @Bean enumStringAArrowFunction = () => StringEnum.A as const;
      @Bean enumStringBProperty = StringEnum.B as const;
      @Bean enumStringBMethod() { return StringEnum.B as const; }
      @Bean enumStringArrowFunction = () => StringEnum.B as const;

      @Bean enumNumberAProperty = NumberEnum.A as const;
      @Bean enumNumberAMethod() { return NumberEnum.A as const; }
      @Bean enumNumberAArrowFunction = () => NumberEnum.A as const;
      @Bean enumNumberBProperty = NumberEnum.B as const;
      @Bean enumNumberBMethod() { return NumberEnum.B as const; }
      @Bean enumNumberArrowFunction = () => NumberEnum.B as const;

      dependencyHolder = Bean(DependencyHolder);

      @PostConstruct
      postConstruct(
        enumStringAProperty: StringEnum.A,
        enumStringAMethod: StringEnum.A,
        enumStringAArrowFunction: StringEnum.A,
        enumStringBProperty: StringEnum.B,
        enumStringBMethod: StringEnum.B,
        enumStringArrowFunction: StringEnum.B,
        enumNumberAProperty: NumberEnum.A,
        enumNumberAMethod: NumberEnum.A,
        enumNumberAArrowFunction: NumberEnum.A,
        enumNumberBProperty: NumberEnum.B,
        enumNumberBMethod: NumberEnum.B,
        enumNumberArrowFunction: NumberEnum.B,
      ) {
        postConstructSpy({
          enumStringAProperty,
          enumStringAMethod,
          enumStringAArrowFunction,
          enumStringBProperty,
          enumStringBMethod,
          enumStringArrowFunction,
          enumNumberAProperty,
          enumNumberAMethod,
          enumNumberAArrowFunction,
          enumNumberBProperty,
          enumNumberBMethod,
          enumNumberArrowFunction,
        });
      }

      @PreDestroy
      preDestroy(
        enumStringAProperty: StringEnum.A,
        enumStringAMethod: StringEnum.A,
        enumStringAArrowFunction: StringEnum.A,
        enumStringBProperty: StringEnum.B,
        enumStringBMethod: StringEnum.B,
        enumStringArrowFunction: StringEnum.B,
        enumNumberAProperty: NumberEnum.A,
        enumNumberAMethod: NumberEnum.A,
        enumNumberAArrowFunction: NumberEnum.A,
        enumNumberBProperty: NumberEnum.B,
        enumNumberBMethod: NumberEnum.B,
        enumNumberArrowFunction: NumberEnum.B,
      ) {
        preDestroySpy({
          enumStringAProperty,
          enumStringAMethod,
          enumStringAArrowFunction,
          enumStringBProperty,
          enumStringBMethod,
          enumStringArrowFunction,
          enumNumberAProperty,
          enumNumberAMethod,
          enumNumberAArrowFunction,
          enumNumberBProperty,
          enumNumberBMethod,
          enumNumberArrowFunction,
        });
      }

      exposed = ExposeBeans<{ dependencyHolder: DependencyHolder }>()
    }

    const expectedObject = {
      enumStringAProperty: StringEnum.A,
      enumStringAMethod: StringEnum.A,
      enumStringAArrowFunction: StringEnum.A,
      enumStringBProperty: StringEnum.B,
      enumStringBMethod: StringEnum.B,
      enumStringArrowFunction: StringEnum.B,
      enumNumberAProperty: NumberEnum.A,
      enumNumberAMethod: NumberEnum.A,
      enumNumberAArrowFunction: NumberEnum.A,
      enumNumberBProperty: NumberEnum.B,
      enumNumberBMethod: NumberEnum.B,
      enumNumberArrowFunction: NumberEnum.B,
    }

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const dependencyHolder = await application.getExposedBean('dependencyHolder');

    //Then
    expect(postConstructSpy.calledOnceWithExactly(expectedObject)).toBe(true)
    expect(preDestroySpy.notCalled).toBe(true);

    expect(dependencyHolder).toEqual(expectedObject);

    await application.close();

    expect(postConstructSpy.calledOnce).toBe(true);
    expect(preDestroySpy.calledOnceWithExactly(expectedObject)).toBe(true);
  });

  it('should work with objects without inheritance', async() => {
    //Given
    const postConstructSpy = sinon.spy();
    const preDestroySpy = sinon.spy();

    type TypeObject = { typeObject: true; counter: number };
    interface InterfaceObject { interfaceObject: true; counter: number }
    class ClassObject {
      private static counter = 0;
      classObject = true; counter = ClassObject.counter++;
    }

    class DependencyHolder {
      constructor(
        public readonly typeObjectProperty: TypeObject,
        public readonly typeObjectMethod: TypeObject,
        public readonly typeObjectArrowFunction: TypeObject,
        public readonly interfaceObjectProperty: InterfaceObject,
        public readonly interfaceObjectMethod: InterfaceObject,
        public readonly interfaceObjectArrowFunction: InterfaceObject,
        public readonly classObjectProperty: ClassObject,
        public readonly classObjectMethod: ClassObject,
        public readonly classObjectArrowFunction: ClassObject,
        public readonly classObjectBeanConstructor: ClassObject,
      ) {}
    }
    @ClawjectApplication
    class Application {
      @Bean typeObjectProperty: TypeObject = { typeObject: true, counter: 0 };
      @Bean typeObjectMethod(): TypeObject { return { typeObject: true, counter: 1 }; }
      @Bean typeObjectArrowFunction = (): TypeObject => ({ typeObject: true, counter: 2 });
      @Bean interfaceObjectProperty: InterfaceObject = { interfaceObject: true, counter: 0 };
      @Bean interfaceObjectMethod(): InterfaceObject { return { interfaceObject: true, counter: 1 }; }
      @Bean interfaceObjectArrowFunction = (): InterfaceObject => ({ interfaceObject: true, counter: 2 });
      @Bean classObjectProperty = new ClassObject();
      @Bean classObjectMethod(): ClassObject { return new ClassObject(); }
      @Bean classObjectArrowFunction = () => new ClassObject();
      classObjectBeanConstructor = Bean(ClassObject);

      dependencyHolder = Bean(DependencyHolder);

      @PostConstruct
      postConstruct(
        typeObjectProperty: TypeObject,
        typeObjectMethod: TypeObject,
        typeObjectArrowFunction: TypeObject,
        interfaceObjectProperty: InterfaceObject,
        interfaceObjectMethod: InterfaceObject,
        interfaceObjectArrowFunction: InterfaceObject,
        classObjectProperty: ClassObject,
        classObjectMethod: ClassObject,
        classObjectArrowFunction: ClassObject,
        classObjectBeanConstructor: ClassObject,
      ) {
        postConstructSpy({
          typeObjectProperty,
          typeObjectMethod,
          typeObjectArrowFunction,
          interfaceObjectProperty,
          interfaceObjectMethod,
          interfaceObjectArrowFunction,
          classObjectProperty,
          classObjectMethod,
          classObjectArrowFunction,
          classObjectBeanConstructor,
        });
      }

      @PreDestroy
      preDestroy(
        typeObjectProperty: TypeObject,
        typeObjectMethod: TypeObject,
        typeObjectArrowFunction: TypeObject,
        interfaceObjectProperty: InterfaceObject,
        interfaceObjectMethod: InterfaceObject,
        interfaceObjectArrowFunction: InterfaceObject,
        classObjectProperty: ClassObject,
        classObjectMethod: ClassObject,
        classObjectArrowFunction: ClassObject,
        classObjectBeanConstructor: ClassObject,
      ) {
        preDestroySpy({
          typeObjectProperty,
          typeObjectMethod,
          typeObjectArrowFunction,
          interfaceObjectProperty,
          interfaceObjectMethod,
          interfaceObjectArrowFunction,
          classObjectProperty,
          classObjectMethod,
          classObjectArrowFunction,
          classObjectBeanConstructor,
        });
      }

      exposed = ExposeBeans<{ dependencyHolder: DependencyHolder }>()
    }

    const expectedObject = {
      typeObjectProperty: { typeObject: true, counter: 0 },
      typeObjectMethod: { typeObject: true, counter: 1 },
      typeObjectArrowFunction: { typeObject: true, counter: 2 },
      interfaceObjectProperty: { interfaceObject: true, counter: 0 },
      interfaceObjectMethod: { interfaceObject: true, counter: 1 },
      interfaceObjectArrowFunction: { interfaceObject: true, counter: 2 },
      classObjectProperty: { classObject: true, counter: 0 },
      classObjectMethod: { classObject: true, counter: 1 },
      classObjectArrowFunction: { classObject: true, counter: 2 },
      classObjectBeanConstructor: { classObject: true, counter: 3 },
    }

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const dependencyHolder = await application.getExposedBean('dependencyHolder');

    //Then
    expect(postConstructSpy.firstCall.firstArg).toEqual(expectedObject);

    expect(postConstructSpy.calledOnce).toBe(true);
    expect(preDestroySpy.notCalled).toBe(true);

    expect(dependencyHolder).toEqual(expectedObject);

    await application.close();

    expect(postConstructSpy.calledOnce).toBe(true);
    expect(preDestroySpy.firstCall.firstArg).toEqual(expectedObject);
  });
});
