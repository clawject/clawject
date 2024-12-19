import sinon from 'sinon';
import { Bean, ClawjectApplication, ClawjectFactory, ExposeBeans, PostConstruct, PreDestroy, Primary } from '@clawject/di';

describe('TypeSystem', () => {
  it('should work with strings', async () => {
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
      ) {
      }
    }

    @ClawjectApplication
    class Application {
      @Bean stringProperty = 'stringProperty';

      @Bean stringFactoryMethod() {
        return 'stringFactoryMethod';
      }

      @Bean stringFactoryArrowFunction = () => 'stringFactoryArrowFunction';

      @Bean stringLiteralProperty = 'stringLiteralProperty' as const;

      @Bean stringLiteralFactoryMethod() {
        return 'stringLiteralFactoryMethod' as const;
      }

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

      exposed = ExposeBeans<{ dependencyHolder: DependencyHolder }>();
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
    expect(postConstructSpy.calledOnceWithExactly(expectedObject)).toBe(true);
    expect(preDestroySpy.notCalled).toBe(true);

    expect(dependencyHolder).toEqual(expectedObject);

    await application.destroy();

    expect(postConstructSpy.calledOnce).toBe(true);
    expect(preDestroySpy.calledOnceWithExactly(expectedObject)).toBe(true);
  });

  it('should work with numbers', async () => {
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
      ) {
      }
    }

    @ClawjectApplication
    class Application {
      @Bean numberProperty = 1;

      @Bean numberFactoryMethod() {
        return 2;
      }

      @Bean numberFactoryArrowFunction = () => 3;

      @Bean numberLiteralProperty = 42 as const;

      @Bean numberLiteralFactoryMethod() {
        return 43 as const;
      }

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

      exposed = ExposeBeans<{ dependencyHolder: DependencyHolder }>();
    }

    const expectedObject = {
      numberProperty: 1,
      numberFactoryMethod: 2,
      numberFactoryArrowFunction: 3,
      literal0: 42,
      literal1: 43,
      literal2: 44,
    };

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const dependencyHolder = await application.getExposedBean('dependencyHolder');

    //Then
    expect(postConstructSpy.calledOnceWithExactly(expectedObject)).toBe(true);
    expect(preDestroySpy.notCalled).toBe(true);

    expect(dependencyHolder).toEqual(expectedObject);

    await application.destroy();

    expect(postConstructSpy.calledOnce).toBe(true);
    expect(preDestroySpy.calledOnceWithExactly(expectedObject)).toBe(true);
  });

  it('should work with big integers', async () => {
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
      ) {
      }
    }

    @ClawjectApplication
    class Application {
      @Bean bigintProperty = 1n;

      @Bean bigintFactoryMethod() {
        return 2n;
      }

      @Bean bigintFactoryArrowFunction = () => 3n;

      @Bean bigintLiteralProperty = 42n as const;

      @Bean bigintLiteralFactoryMethod() {
        return 43n as const;
      }

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

      exposed = ExposeBeans<{ dependencyHolder: DependencyHolder }>();
    }

    const expectedObject = {
      bigintProperty: 1n,
      bigintFactoryMethod: 2n,
      bigintFactoryArrowFunction: 3n,
      literal0: 42n,
      literal1: 43n,
      literal2: 44n,
    };

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const dependencyHolder = await application.getExposedBean('dependencyHolder');

    //Then
    expect(postConstructSpy.calledOnceWithExactly(expectedObject)).toBe(true);
    expect(preDestroySpy.notCalled).toBe(true);

    expect(dependencyHolder).toEqual(expectedObject);

    await application.destroy();

    expect(postConstructSpy.calledOnce).toBe(true);
    expect(preDestroySpy.calledOnceWithExactly(expectedObject)).toBe(true);
  });

  it('should work with enums', async () => {
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
      ) {
      }
    }

    @ClawjectApplication
    class Application {
      @Bean enumStringAProperty = StringEnum.A as const;

      @Bean enumStringAMethod() {
        return StringEnum.A as const;
      }

      @Bean enumStringAArrowFunction = () => StringEnum.A as const;
      @Bean enumStringBProperty = StringEnum.B as const;

      @Bean enumStringBMethod() {
        return StringEnum.B as const;
      }

      @Bean enumStringArrowFunction = () => StringEnum.B as const;

      @Bean enumNumberAProperty = NumberEnum.A as const;

      @Bean enumNumberAMethod() {
        return NumberEnum.A as const;
      }

      @Bean enumNumberAArrowFunction = () => NumberEnum.A as const;
      @Bean enumNumberBProperty = NumberEnum.B as const;

      @Bean enumNumberBMethod() {
        return NumberEnum.B as const;
      }

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

      exposed = ExposeBeans<{ dependencyHolder: DependencyHolder }>();
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
    };

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const dependencyHolder = await application.getExposedBean('dependencyHolder');

    //Then
    expect(postConstructSpy.calledOnceWithExactly(expectedObject)).toBe(true);
    expect(preDestroySpy.notCalled).toBe(true);

    expect(dependencyHolder).toEqual(expectedObject);

    await application.destroy();

    expect(postConstructSpy.calledOnce).toBe(true);
    expect(preDestroySpy.calledOnceWithExactly(expectedObject)).toBe(true);
  });

  it('should work with objects', async () => {
    //Given
    const postConstructSpy = sinon.spy();
    const preDestroySpy = sinon.spy();

    type TypeObject = { typeObject: true; counter: number };

    interface InterfaceObject {
      interfaceObject: true;
      counter: number;
    }

    class ClassObject {
      private static counter = 0;
      classObject = true;
      counter = ClassObject.counter++;
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
      ) {
      }
    }

    @ClawjectApplication
    class Application {
      @Bean typeObjectProperty: TypeObject = {typeObject: true, counter: 0};

      @Bean typeObjectMethod(): TypeObject {
        return {typeObject: true, counter: 1};
      }

      @Bean typeObjectArrowFunction = (): TypeObject => ({typeObject: true, counter: 2});
      @Bean interfaceObjectProperty: InterfaceObject = {interfaceObject: true, counter: 0};

      @Bean interfaceObjectMethod(): InterfaceObject {
        return {interfaceObject: true, counter: 1};
      }

      @Bean interfaceObjectArrowFunction = (): InterfaceObject => ({interfaceObject: true, counter: 2});
      @Bean classObjectProperty = new ClassObject();

      @Bean classObjectMethod(): ClassObject {
        return new ClassObject();
      }

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

      exposed = ExposeBeans<{ dependencyHolder: DependencyHolder }>();
    }

    const expectedObject = {
      typeObjectProperty: {typeObject: true, counter: 0},
      typeObjectMethod: {typeObject: true, counter: 1},
      typeObjectArrowFunction: {typeObject: true, counter: 2},
      interfaceObjectProperty: {interfaceObject: true, counter: 0},
      interfaceObjectMethod: {interfaceObject: true, counter: 1},
      interfaceObjectArrowFunction: {interfaceObject: true, counter: 2},
      classObjectProperty: {classObject: true, counter: 0},
      classObjectMethod: {classObject: true, counter: 1},
      classObjectArrowFunction: {classObject: true, counter: 2},
      classObjectBeanConstructor: {classObject: true, counter: 3},
    };

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const dependencyHolder = await application.getExposedBean('dependencyHolder');

    //Then
    expect(postConstructSpy.firstCall.firstArg).toEqual(expectedObject);

    expect(postConstructSpy.calledOnce).toBe(true);
    expect(preDestroySpy.notCalled).toBe(true);

    expect(dependencyHolder).toEqual(expectedObject);

    await application.destroy();

    expect(postConstructSpy.calledOnce).toBe(true);
    expect(preDestroySpy.firstCall.firstArg).toEqual(expectedObject);
  });

  it('should work with objects with generics', async () => {
    //Given
    const postConstructSpy = sinon.spy();
    const preDestroySpy = sinon.spy();

    type NestedTypeObject<T> = { nestedTypeObject: true; counter: number, data: T };
    type TypeObject<T> = { typeObject: true; counter: number, data: T };

    interface NestedInterfaceObject<T> {
      nestedInterfaceObject: true;
      counter: number,
      data: T
    }
    interface InterfaceObject<T> {
      interfaceObject: true;
      counter: number,
      data: T
    }

    class NestedClassObject<T> {
      private static counter = 0;
      nestedClassObject = true;
      counter = NestedClassObject.counter++;

      constructor(
        public readonly data: T,
      ) {}
    }
    class ClassObject<T> {
      private static counter = 0;
      classObject = true;
      counter = ClassObject.counter++;

      constructor(
        public readonly data: T,
      ) {}
    }

    class DependencyHolder {
      constructor(
        public readonly typeObjectString: TypeObject<string>,
        public readonly typeObjectNumber: TypeObject<number>,
        public readonly interfaceObjectString: InterfaceObject<string>,
        public readonly interfaceObjectNumber: InterfaceObject<number>,
        public readonly classObjectString: ClassObject<string>,
        public readonly classObjectNumber: ClassObject<number>,
        public readonly typeObjectNestedString: TypeObject<NestedTypeObject<string>>,
        public readonly typeObjectNestedNumber: TypeObject<NestedTypeObject<number>>,
        public readonly interfaceObjectNestedString: InterfaceObject<NestedInterfaceObject<string>>,
        public readonly interfaceObjectNestedNumber: InterfaceObject<NestedInterfaceObject<number>>,
        public readonly classObjectNestedString: ClassObject<NestedClassObject<string>>,
        public readonly classObjectNestedNumber: ClassObject<NestedClassObject<number>>,
      ) {}
    }

    @ClawjectApplication
    class Application {
      @Bean str = 'string';
      @Bean num = 42;

      @Bean @Primary typeObjectStringProperty: TypeObject<string> = {typeObject: true, counter: 0, data: 'string'};
      @Bean @Primary typeObjectNestedStringProperty: TypeObject<NestedTypeObject<string>> = {typeObject: true, counter: 0, data: { nestedTypeObject: true, counter: 0, data: 'string' }};
      @Bean @Primary typeObjectNumberProperty: TypeObject<number> = {typeObject: true, counter: 0, data: 42};
      @Bean @Primary typeObjectNestedNumberProperty: TypeObject<NestedTypeObject<number>> = {typeObject: true, counter: 0, data: { nestedTypeObject: true, counter: 0, data: 42 }};

      @Bean typeObjectStringMethod(): TypeObject<string> {
        return {typeObject: true, counter: 1, data: 'string'};
      }
      @Bean typeObjectNestedStringMethod(): TypeObject<NestedTypeObject<string>> {
        return {typeObject: true, counter: 1, data: { nestedTypeObject: true, counter: 1, data: 'string' }};
      }

      @Bean typeObjectNumberMethod(): TypeObject<number> {
        return {typeObject: true, counter: 1, data: 42};
      }
      @Bean typeObjectNestedNumberMethod(): TypeObject<NestedTypeObject<number>> {
        return {typeObject: true, counter: 1, data: { nestedTypeObject: true, counter: 1, data: 42 }};
      }

      @Bean typeObjectStringArrowFunction = (): TypeObject<string> => ({typeObject: true, counter: 2, data: 'string'});
      @Bean typeObjectNestedStringArrowFunction = (): TypeObject<NestedTypeObject<string>> => ({typeObject: true, counter: 2, data: { nestedTypeObject: true, counter: 2, data: 'string' }});
      @Bean typeObjectNumberArrowFunction = (): TypeObject<number> => ({typeObject: true, counter: 2, data: 42});
      @Bean typeObjectNestedNumberArrowFunction = (): TypeObject<NestedTypeObject<number>> => ({typeObject: true, counter: 2, data: { nestedTypeObject: true, counter: 2, data: 42 }});

      @Bean @Primary interfaceObjectStringProperty: InterfaceObject<string> = {
        interfaceObject: true,
        counter: 0,
        data: 'string'
      };
      @Bean @Primary interfaceObjectNestedStringProperty: InterfaceObject<NestedInterfaceObject<string>> = {
        interfaceObject: true,
        counter: 0,
        data: { nestedInterfaceObject: true, counter: 0, data: 'string' }
      };
      @Bean @Primary interfaceObjectNumberProperty: InterfaceObject<number> = {
        interfaceObject: true,
        counter: 0,
        data: 42
      };
      @Bean @Primary interfaceObjectNestedNumberProperty: InterfaceObject<NestedInterfaceObject<number>> = {
        interfaceObject: true,
        counter: 0,
        data: { nestedInterfaceObject: true, counter: 0, data: 42 }
      };

      @Bean interfaceObjectStringMethod(): InterfaceObject<string> {
        return {interfaceObject: true, counter: 1, data: 'string'};
      }
      @Bean interfaceObjectNestedStringMethod(): InterfaceObject<NestedInterfaceObject<string>> {
        return {interfaceObject: true, counter: 1, data: { nestedInterfaceObject: true, counter: 1, data: 'string' }};
      }

      @Bean interfaceObjectNumberMethod(): InterfaceObject<number> {
        return {interfaceObject: true, counter: 1, data: 42};
      }
      @Bean interfaceObjectNestedNumberMethod(): InterfaceObject<NestedInterfaceObject<number>> {
        return {interfaceObject: true, counter: 1, data: { nestedInterfaceObject: true, counter: 1, data: 42 }};
      }

      @Bean interfaceObjectStringArrowFunction = (): InterfaceObject<string> => ({
        interfaceObject: true,
        counter: 2,
        data: 'string'
      });
      @Bean interfaceObjectNestedStringArrowFunction = (): InterfaceObject<NestedInterfaceObject<string>> => ({
        interfaceObject: true,
        counter: 2,
        data: { nestedInterfaceObject: true, counter: 2, data: 'string' }
      });
      @Bean interfaceObjectNumberArrowFunction = (): InterfaceObject<number> => ({
        interfaceObject: true,
        counter: 2,
        data: 42
      });
      @Bean interfaceObjectNestedNumberArrowFunction = (): InterfaceObject<NestedInterfaceObject<number>> => ({
        interfaceObject: true,
        counter: 2,
        data: { nestedInterfaceObject: true, counter: 2, data: 42 }
      });

      @Bean @Primary classObjectStringProperty = new ClassObject('string');
      @Bean @Primary classObjectNestedStringProperty = new ClassObject(new NestedClassObject('string'));
      @Bean @Primary classObjectNumberProperty = new ClassObject(42);
      @Bean @Primary classObjectNestedNumberProperty = new ClassObject(new NestedClassObject(42));

      @Bean classObjectStringMethod(): ClassObject<string> {
        return new ClassObject('string');
      }
      @Bean classObjectNestedStringMethod(): ClassObject<NestedClassObject<string>> {
        return new ClassObject(new NestedClassObject('string'));
      }

      @Bean classObjectNumberMethod(): ClassObject<number> {
        return new ClassObject(42);
      }
      @Bean classObjectNestedNumberMethod(): ClassObject<NestedClassObject<number>> {
        return new ClassObject(new NestedClassObject(42));
      }

      @Bean classObjectStringArrowFunction = () => new ClassObject('string');
      @Bean classObjectNestedStringArrowFunction = () => new ClassObject(new NestedClassObject('string'));
      @Bean classObjectNumberArrowFunction = () => new ClassObject(42);
      @Bean classObjectNestedNumberArrowFunction = () => new ClassObject(new NestedClassObject(42));

      classObjectStringBeanConstructor = Bean(ClassObject<string>);
      classObjectNumberBeanConstructor = Bean(ClassObject<number>);

      dependencyHolder = Bean(DependencyHolder);

      @PostConstruct
      postConstruct(
        typeObjectStringProperty: TypeObject<string>,
        typeObjectNumberProperty: TypeObject<number>,
        typeObjectStringMethod: TypeObject<string>,
        typeObjectNumberMethod: TypeObject<number>,
        typeObjectStringArrowFunction: TypeObject<string>,
        typeObjectNumberArrowFunction: TypeObject<number>,
        interfaceObjectStringProperty: InterfaceObject<string>,
        interfaceObjectNumberProperty: InterfaceObject<number>,
        interfaceObjectStringMethod: InterfaceObject<string>,
        interfaceObjectNumberMethod: InterfaceObject<number>,
        interfaceObjectStringArrowFunction: InterfaceObject<string>,
        interfaceObjectNumberArrowFunction: InterfaceObject<number>,
        classObjectStringProperty: ClassObject<string>,
        classObjectNumberProperty: ClassObject<number>,
        classObjectStringMethod: ClassObject<string>,
        classObjectNumberMethod: ClassObject<number>,
        classObjectStringArrowFunction: ClassObject<string>,
        classObjectNumberArrowFunction: ClassObject<number>,
        classObjectStringBeanConstructor: ClassObject<string>,
        classObjectNumberBeanConstructor: ClassObject<number>,
      ) {
        postConstructSpy({
          typeObjectStringProperty,
          typeObjectNumberProperty,
          typeObjectStringMethod,
          typeObjectNumberMethod,
          typeObjectStringArrowFunction,
          typeObjectNumberArrowFunction,
          interfaceObjectStringProperty,
          interfaceObjectNumberProperty,
          interfaceObjectStringMethod,
          interfaceObjectNumberMethod,
          interfaceObjectStringArrowFunction,
          interfaceObjectNumberArrowFunction,
          classObjectStringProperty,
          classObjectNumberProperty,
          classObjectStringMethod,
          classObjectNumberMethod,
          classObjectStringArrowFunction,
          classObjectNumberArrowFunction,
          classObjectStringBeanConstructor,
          classObjectNumberBeanConstructor,
        });
      }

      @PreDestroy
      preDestroy(
        typeObjectStringProperty: TypeObject<string>,
        typeObjectNumberProperty: TypeObject<number>,
        typeObjectStringMethod: TypeObject<string>,
        typeObjectNumberMethod: TypeObject<number>,
        typeObjectStringArrowFunction: TypeObject<string>,
        typeObjectNumberArrowFunction: TypeObject<number>,
        interfaceObjectStringProperty: InterfaceObject<string>,
        interfaceObjectNumberProperty: InterfaceObject<number>,
        interfaceObjectStringMethod: InterfaceObject<string>,
        interfaceObjectNumberMethod: InterfaceObject<number>,
        interfaceObjectStringArrowFunction: InterfaceObject<string>,
        interfaceObjectNumberArrowFunction: InterfaceObject<number>,
        classObjectStringProperty: ClassObject<string>,
        classObjectNumberProperty: ClassObject<number>,
        classObjectStringMethod: ClassObject<string>,
        classObjectNumberMethod: ClassObject<number>,
        classObjectStringArrowFunction: ClassObject<string>,
        classObjectNumberArrowFunction: ClassObject<number>,
        classObjectStringBeanConstructor: ClassObject<string>,
        classObjectNumberBeanConstructor: ClassObject<number>,
      ) {
        preDestroySpy({
          typeObjectStringProperty,
          typeObjectNumberProperty,
          typeObjectStringMethod,
          typeObjectNumberMethod,
          typeObjectStringArrowFunction,
          typeObjectNumberArrowFunction,
          interfaceObjectStringProperty,
          interfaceObjectNumberProperty,
          interfaceObjectStringMethod,
          interfaceObjectNumberMethod,
          interfaceObjectStringArrowFunction,
          interfaceObjectNumberArrowFunction,
          classObjectStringProperty,
          classObjectNumberProperty,
          classObjectStringMethod,
          classObjectNumberMethod,
          classObjectStringArrowFunction,
          classObjectNumberArrowFunction,
          classObjectStringBeanConstructor,
          classObjectNumberBeanConstructor,
        });
      }

      exposed = ExposeBeans<{ dependencyHolder: DependencyHolder }>();
    }

    const expectedObjectLifecycle = {
      typeObjectStringProperty: {typeObject: true, counter: 0, data: 'string'},
      typeObjectNumberProperty: {typeObject: true, counter: 0, data: 42},
      typeObjectStringMethod: {typeObject: true, counter: 1, data: 'string'},
      typeObjectNumberMethod: {typeObject: true, counter: 1, data: 42},
      typeObjectStringArrowFunction: {typeObject: true, counter: 2, data: 'string'},
      typeObjectNumberArrowFunction: {typeObject: true, counter: 2, data: 42},
      interfaceObjectStringProperty: {interfaceObject: true, counter: 0, data: 'string'},
      interfaceObjectNumberProperty: {interfaceObject: true, counter: 0, data: 42},
      interfaceObjectStringMethod: {interfaceObject: true, counter: 1, data: 'string'},
      interfaceObjectNumberMethod: {interfaceObject: true, counter: 1, data: 42},
      interfaceObjectStringArrowFunction: {interfaceObject: true, counter: 2, data: 'string'},
      interfaceObjectNumberArrowFunction: {interfaceObject: true, counter: 2, data: 42},
      classObjectStringProperty: {classObject: true, counter: 0, data: 'string'},
      classObjectNumberProperty: {classObject: true, counter: 1, data: 42},
      classObjectStringMethod: {classObject: true, counter: 2, data: 'string'},
      classObjectNumberMethod: {classObject: true, counter: 3, data: 42},
      classObjectStringArrowFunction: {classObject: true, counter: 4, data: 'string'},
      classObjectNumberArrowFunction: {classObject: true, counter: 5, data: 42},
      classObjectStringBeanConstructor: {classObject: true, counter: 6, data: 'string'},
      classObjectNumberBeanConstructor: {classObject: true, counter: 7, data: 42},
    };
    const expectedObject = {
      typeObjectString: {typeObject: true, counter: 0, data: 'string'},
      typeObjectNumber: {typeObject: true, counter: 0, data: 42},
      interfaceObjectString: {interfaceObject: true, counter: 0, data: 'string'},
      interfaceObjectNumber: {interfaceObject: true, counter: 0, data: 42},
      classObjectString: {classObject: true, counter: 0, data: 'string'},
      classObjectNumber: {classObject: true, counter: 1, data: 42},
    };

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const dependencyHolder = await application.getExposedBean('dependencyHolder');

    //Then
    expect(postConstructSpy.firstCall.firstArg).toEqual(expectedObjectLifecycle);

    expect(postConstructSpy.calledOnce).toBe(true);
    expect(preDestroySpy.notCalled).toBe(true);

    expect(dependencyHolder).toEqual(expectedObject);

    await application.destroy();

    expect(postConstructSpy.calledOnce).toBe(true);
    expect(preDestroySpy.firstCall.firstArg).toEqual(expectedObjectLifecycle);
  });

  it('should work with objects with inheritance', async () => {
    //Given
    const postConstructSpy = sinon.spy();
    const preDestroySpy = sinon.spy();

    type TA = { ta: boolean, counterA: number };
    type TB = { tb: boolean, counterB: number } & TA;
    type TC = { tc: boolean, counterC: number } & TB;

    interface IA {
      ia: boolean,
      counterA: number
    }

    interface IB extends IA {
      ib: boolean,
      counterB: number
    }

    interface IC extends IB {
      ic: boolean,
      counterC: number
    }

    class CA {
      private static counterA = 0;
      ca = true;
      counterA = CA.counterA++;
    }

    class CB extends CA {
      private static counterB = 0;
      cb = true;
      counterB = CB.counterB++;
    }

    class CC extends CB {
      private static counterC = 0;
      cc = true;
      counterC = CC.counterC++;
    }

    class DependencyHolder {
      constructor(
        public readonly ta: TA,
        public readonly tb: TB,
        public readonly tb_ta: TB & TA,
        public readonly tc: TC,
        public readonly tc_tb: TC & TB,
        public readonly tc_ta: TC & TA,
        public readonly tc_tb_ta: TC & TB & TA,
        public readonly ia: IA,
        public readonly ib: IB,
        public readonly ib_ia: IB & IA,
        public readonly ic: IC,
        public readonly ic_ib: IC & IB,
        public readonly ic_ia: IC & IA,
        public readonly ic_ib_ia: IC & IB & IA,
        public readonly ca: CA,
        public readonly cb: CB,
        public readonly cb_ca: CB & CA,
        public readonly cc: CC,
        public readonly cc_cb: CC & CB,
        public readonly cc_ca: CC & CA,
        public readonly cc_cb_ca: CC & CB & CA,
      ) {
      }
    }

    @ClawjectApplication
    class Application {
      @Bean @Primary tcObjectProperty: TC = {tc: true, counterC: 0, tb: true, counterB: 0, ta: true, counterA: 0};

      @Bean tcObjectMethod(): TC {
        return {tc: true, counterC: 1, tb: true, counterB: 1, ta: true, counterA: 1};
      }

      @Bean tcObjectArrowFunction = (): TC => ({tc: true, counterC: 2, tb: true, counterB: 2, ta: true, counterA: 2});

      @Bean @Primary icObjectProperty: IC = {ic: true, counterC: 0, ib: true, counterB: 0, ia: true, counterA: 0};

      @Bean icObjectMethod(): IC {
        return {ic: true, counterC: 1, ib: true, counterB: 1, ia: true, counterA: 1};
      }

      @Bean icObjectArrowFunction = (): IC => ({ic: true, counterC: 2, ib: true, counterB: 2, ia: true, counterA: 2});

      @Bean @Primary ccObjectProperty = new CC();

      @Bean ccObjectMethod(): CC {
        return new CC();
      }

      @Bean ccObjectArrowFunction = () => new CC();
      ccObjectConstructor = Bean(CC);

      dependencyHolder = Bean(DependencyHolder);

      @PostConstruct
      postConstruct(
        ta: TA,
        tb: TB,
        tb_ta: TB & TA,
        tc: TC,
        tc_tb: TC & TB,
        tc_ta: TC & TA,
        tc_tb_ta: TC & TB & TA,
        tcObjectProperty: TC,
        tcObjectMethod: TC,
        tcObjectArrowFunction: TC,
        ia: IA,
        ib: IB,
        ib_ia: IB & IA,
        ic: IC,
        ic_ib: IC & IB,
        ic_ia: IC & IA,
        ic_ib_ia: IC & IB & IA,
        icObjectProperty: IC,
        icObjectMethod: IC,
        icObjectArrowFunction: IC,
        ca: CA,
        cb: CB,
        cb_ca: CB & CA,
        cc: CC,
        cc_cb: CC & CB,
        cc_ca: CC & CA,
        cc_cb_ca: CC & CB & CA,
        ccObjectProperty: CC,
        ccObjectMethod: CC,
        ccObjectArrowFunction: CC,
        ccObjectConstructor: CC,
      ) {
        postConstructSpy({
          ta,
          tb,
          tb_ta,
          tc,
          tc_tb,
          tc_ta,
          tc_tb_ta,
          tcObjectProperty,
          tcObjectMethod,
          tcObjectArrowFunction,
          ia,
          ib,
          ib_ia,
          ic,
          ic_ib,
          ic_ia,
          ic_ib_ia,
          icObjectProperty,
          icObjectMethod,
          icObjectArrowFunction,
          ca,
          cb,
          cb_ca,
          cc,
          cc_cb,
          cc_ca,
          cc_cb_ca,
          ccObjectProperty,
          ccObjectMethod,
          ccObjectArrowFunction,
          ccObjectConstructor,
        });
      }

      @PreDestroy
      preDestroy(
        ta: TA,
        tb: TB,
        tb_ta: TB & TA,
        tc: TC,
        tc_tb: TC & TB,
        tc_ta: TC & TA,
        tc_tb_ta: TC & TB & TA,
        tcObjectProperty: TC,
        tcObjectMethod: TC,
        tcObjectArrowFunction: TC,
        ia: IA,
        ib: IB,
        ib_ia: IB & IA,
        ic: IC,
        ic_ib: IC & IB,
        ic_ia: IC & IA,
        ic_ib_ia: IC & IB & IA,
        icObjectProperty: IC,
        icObjectMethod: IC,
        icObjectArrowFunction: IC,
        ca: CA,
        cb: CB,
        cb_ca: CB & CA,
        cc: CC,
        cc_cb: CC & CB,
        cc_ca: CC & CA,
        cc_cb_ca: CC & CB & CA,
        ccObjectProperty: CC,
        ccObjectMethod: CC,
        ccObjectArrowFunction: CC,
        ccObjectConstructor: CC,
      ) {
        preDestroySpy({
          ta,
          tb,
          tb_ta,
          tc,
          tc_tb,
          tc_ta,
          tc_tb_ta,
          tcObjectProperty,
          tcObjectMethod,
          tcObjectArrowFunction,
          ia,
          ib,
          ib_ia,
          ic,
          ic_ib,
          ic_ia,
          ic_ib_ia,
          icObjectProperty,
          icObjectMethod,
          icObjectArrowFunction,
          ca,
          cb,
          cb_ca,
          cc,
          cc_cb,
          cc_ca,
          cc_cb_ca,
          ccObjectProperty,
          ccObjectMethod,
          ccObjectArrowFunction,
          ccObjectConstructor,
        });
      }

      exposed = ExposeBeans<{ dependencyHolder: DependencyHolder }>();
    }

    const expectedObjectLifecycle = {
      ta: {tc: true, counterC: 0, tb: true, counterB: 0, ta: true, counterA: 0},
      tb: {tc: true, counterC: 0, tb: true, counterB: 0, ta: true, counterA: 0},
      tb_ta: {tc: true, counterC: 0, tb: true, counterB: 0, ta: true, counterA: 0},
      tc: {tc: true, counterC: 0, tb: true, counterB: 0, ta: true, counterA: 0},
      tc_tb: {tc: true, counterC: 0, tb: true, counterB: 0, ta: true, counterA: 0},
      tc_ta: {tc: true, counterC: 0, tb: true, counterB: 0, ta: true, counterA: 0},
      tc_tb_ta: {tc: true, counterC: 0, tb: true, counterB: 0, ta: true, counterA: 0},
      tcObjectProperty: {tc: true, counterC: 0, tb: true, counterB: 0, ta: true, counterA: 0},
      tcObjectMethod: {tc: true, counterC: 1, tb: true, counterB: 1, ta: true, counterA: 1},
      tcObjectArrowFunction: {tc: true, counterC: 2, tb: true, counterB: 2, ta: true, counterA: 2},
      ia: {ic: true, counterC: 0, ib: true, counterB: 0, ia: true, counterA: 0},
      ib: {ic: true, counterC: 0, ib: true, counterB: 0, ia: true, counterA: 0},
      ib_ia: {ic: true, counterC: 0, ib: true, counterB: 0, ia: true, counterA: 0},
      ic: {ic: true, counterC: 0, ib: true, counterB: 0, ia: true, counterA: 0},
      ic_ib: {ic: true, counterC: 0, ib: true, counterB: 0, ia: true, counterA: 0},
      ic_ia: {ic: true, counterC: 0, ib: true, counterB: 0, ia: true, counterA: 0},
      ic_ib_ia: {ic: true, counterC: 0, ib: true, counterB: 0, ia: true, counterA: 0},
      icObjectProperty: {ic: true, counterC: 0, ib: true, counterB: 0, ia: true, counterA: 0},
      icObjectMethod: {ic: true, counterC: 1, ib: true, counterB: 1, ia: true, counterA: 1},
      icObjectArrowFunction: {ic: true, counterC: 2, ib: true, counterB: 2, ia: true, counterA: 2},
      ca: {ca: true, counterA: 0, cb: true, counterB: 0, cc: true, counterC: 0},
      cb: {ca: true, counterA: 0, cb: true, counterB: 0, cc: true, counterC: 0},
      cb_ca: {ca: true, counterA: 0, cb: true, counterB: 0, cc: true, counterC: 0},
      cc: {ca: true, counterA: 0, cb: true, counterB: 0, cc: true, counterC: 0},
      cc_cb: {ca: true, counterA: 0, cb: true, counterB: 0, cc: true, counterC: 0},
      cc_ca: {ca: true, counterA: 0, cb: true, counterB: 0, cc: true, counterC: 0},
      cc_cb_ca: {ca: true, counterA: 0, cb: true, counterB: 0, cc: true, counterC: 0},
      ccObjectProperty: {ca: true, counterA: 0, cb: true, counterB: 0, cc: true, counterC: 0},
      ccObjectMethod: {ca: true, counterA: 1, cb: true, counterB: 1, cc: true, counterC: 1},
      ccObjectArrowFunction: {ca: true, counterA: 2, cb: true, counterB: 2, cc: true, counterC: 2},
      ccObjectConstructor: {ca: true, counterA: 3, cb: true, counterB: 3, cc: true, counterC: 3},
    };
    const expectedObject = {
      ta: {tc: true, counterC: 0, tb: true, counterB: 0, ta: true, counterA: 0},
      tb: {tc: true, counterC: 0, tb: true, counterB: 0, ta: true, counterA: 0},
      tb_ta: {tc: true, counterC: 0, tb: true, counterB: 0, ta: true, counterA: 0},
      tc: {tc: true, counterC: 0, tb: true, counterB: 0, ta: true, counterA: 0},
      tc_tb: {tc: true, counterC: 0, tb: true, counterB: 0, ta: true, counterA: 0},
      tc_ta: {tc: true, counterC: 0, tb: true, counterB: 0, ta: true, counterA: 0},
      tc_tb_ta: {tc: true, counterC: 0, tb: true, counterB: 0, ta: true, counterA: 0},
      ia: {ic: true, counterC: 0, ib: true, counterB: 0, ia: true, counterA: 0},
      ib: {ic: true, counterC: 0, ib: true, counterB: 0, ia: true, counterA: 0},
      ib_ia: {ic: true, counterC: 0, ib: true, counterB: 0, ia: true, counterA: 0},
      ic: {ic: true, counterC: 0, ib: true, counterB: 0, ia: true, counterA: 0},
      ic_ib: {ic: true, counterC: 0, ib: true, counterB: 0, ia: true, counterA: 0},
      ic_ia: {ic: true, counterC: 0, ib: true, counterB: 0, ia: true, counterA: 0},
      ic_ib_ia: {ic: true, counterC: 0, ib: true, counterB: 0, ia: true, counterA: 0},
      ca: {ca: true, counterA: 0, cb: true, counterB: 0, cc: true, counterC: 0},
      cb: {ca: true, counterA: 0, cb: true, counterB: 0, cc: true, counterC: 0},
      cb_ca: {ca: true, counterA: 0, cb: true, counterB: 0, cc: true, counterC: 0},
      cc: {ca: true, counterA: 0, cb: true, counterB: 0, cc: true, counterC: 0},
      cc_cb: {ca: true, counterA: 0, cb: true, counterB: 0, cc: true, counterC: 0},
      cc_ca: {ca: true, counterA: 0, cb: true, counterB: 0, cc: true, counterC: 0},
      cc_cb_ca: {ca: true, counterA: 0, cb: true, counterB: 0, cc: true, counterC: 0},
    };

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const dependencyHolder = await application.getExposedBean('dependencyHolder');

    //Then
    expect(postConstructSpy.firstCall.firstArg).toEqual(expectedObjectLifecycle);

    expect(postConstructSpy.calledOnce).toBe(true);
    expect(preDestroySpy.notCalled).toBe(true);

    expect(dependencyHolder).toEqual(expectedObject);

    await application.destroy();

    expect(postConstructSpy.calledOnce).toBe(true);
    expect(preDestroySpy.firstCall.firstArg).toEqual(expectedObjectLifecycle);
  });

  it('should work with objects with inheritance and generics', async () => {
    //Given
    const postConstructSpy = sinon.spy();
    const preDestroySpy = sinon.spy();

    type TA<T> = { ta: boolean, counterA: number, data: T };
    type TB<T> = { tb: boolean, counterB: number } & TA<T>;
    type TC<T> = { tc: boolean, counterC: number } & TB<T>;

    interface IA<T> {
      ia: boolean,
      counterA: number,
      data: T
    }

    interface IB<T> extends IA<T> {
      ib: boolean,
      counterB: number
    }

    interface IC<T> extends IB<T> {
      ic: boolean,
      counterC: number
    }

    class CA<T> {
      private static counterA = 0;
      ca = true;
      counterA = CA.counterA++;

      constructor(
        public readonly data: T,
      ) {
      }
    }

    class CB<T> extends CA<T> {
      private static counterB = 0;
      cb = true;
      counterB = CB.counterB++;
    }

    class CC<T> extends CB<T> {
      private static counterC = 0;
      cc = true;
      counterC = CC.counterC++;
    }

    class DependencyHolder {
      constructor(
        public readonly ta_string: TA<string>,
        public readonly tb_string: TB<string>,
        public readonly tb_ta_string: TB<string> & TA<string>,
        public readonly tc_string: TC<string>,
        public readonly tc_tb_string: TC<string> & TB<string>,
        public readonly tc_ta_string: TC<string> & TA<string>,
        public readonly tc_tb_ta_string: TC<string> & TB<string> & TA<string>,
        public readonly ta_number: TA<number>,
        public readonly tb_number: TB<number>,
        public readonly tb_ta_number: TB<number> & TA<number>,
        public readonly tc_number: TC<number>,
        public readonly tc_tb_number: TC<number> & TB<number>,
        public readonly tc_ta_number: TC<number> & TA<number>,
        public readonly tc_tb_ta_number: TC<number> & TB<number> & TA<number>,
        public readonly ia_string: IA<string>,
        public readonly ib_string: IB<string>,
        public readonly ib_ia_string: IB<string> & IA<string>,
        public readonly ic_string: IC<string>,
        public readonly ic_ib_string: IC<string> & IB<string>,
        public readonly ic_ia_string: IC<string> & IA<string>,
        public readonly ic_ib_ia_string: IC<string> & IB<string> & IA<string>,
        public readonly ia_number: IA<number>,
        public readonly ib_number: IB<number>,
        public readonly ib_ia_number: IB<number> & IA<number>,
        public readonly ic_number: IC<number>,
        public readonly ic_ib_number: IC<number> & IB<number>,
        public readonly ic_ia_number: IC<number> & IA<number>,
        public readonly ic_ib_ia_number: IC<number> & IB<number> & IA<number>,
        public readonly ca_string: CA<string>,
        public readonly cb_string: CB<string>,
        public readonly cb_ca_string: CB<string> & CA<string>,
        public readonly cc_string: CC<string>,
        public readonly cc_cb_string: CC<string> & CB<string>,
        public readonly cc_ca_string: CC<string> & CA<string>,
        public readonly cc_cb_ca_string: CC<string> & CB<string> & CA<string>,
        public readonly ca_number: CA<number>,
        public readonly cb_number: CB<number>,
        public readonly cb_ca_number: CB<number> & CA<number>,
        public readonly cc_number: CC<number>,
        public readonly cc_cb_number: CC<number> & CB<number>,
        public readonly cc_ca_number: CC<number> & CA<number>,
        public readonly cc_cb_ca_number: CC<number> & CB<number> & CA<number>,
      ) {
      }
    }

    @ClawjectApplication
    class Application {
      @Bean str = 'string';
      @Bean num = 42;

      @Bean @Primary tcObjectPropertyString: TC<string> = {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 'string'
      };
      @Bean @Primary tcObjectPropertyNumber: TC<number> = {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 42
      };

      @Bean tcObjectMethodString(): TC<string> {
        return {tc: true, counterC: 1, tb: true, counterB: 1, ta: true, counterA: 1, data: 'string'};
      }

      @Bean tcObjectMethodNumber(): TC<number> {
        return {tc: true, counterC: 1, tb: true, counterB: 1, ta: true, counterA: 1, data: 42};
      }

      @Bean tcObjectArrowFunctionString = (): TC<string> => ({
        tc: true,
        counterC: 2,
        tb: true,
        counterB: 2,
        ta: true,
        counterA: 2,
        data: 'string'
      });
      @Bean tcObjectArrowFunctionNumber = (): TC<number> => ({
        tc: true,
        counterC: 2,
        tb: true,
        counterB: 2,
        ta: true,
        counterA: 2,
        data: 42
      });

      @Bean @Primary icObjectPropertyString: IC<string> = {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 'string'
      };
      @Bean @Primary icObjectPropertyNumber: IC<number> = {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 42
      };

      @Bean icObjectMethodString(): IC<string> {
        return {ic: true, counterC: 1, ib: true, counterB: 1, ia: true, counterA: 1, data: 'string'};
      }

      @Bean icObjectMethodNumber(): IC<number> {
        return {ic: true, counterC: 1, ib: true, counterB: 1, ia: true, counterA: 1, data: 42};
      }

      @Bean icObjectArrowFunctionString = (): IC<string> => ({
        ic: true,
        counterC: 2,
        ib: true,
        counterB: 2,
        ia: true,
        counterA: 2,
        data: 'string'
      });
      @Bean icObjectArrowFunctionNumber = (): IC<number> => ({
        ic: true,
        counterC: 2,
        ib: true,
        counterB: 2,
        ia: true,
        counterA: 2,
        data: 42
      });

      @Bean @Primary ccObjectPropertyString = new CC<string>('string');
      @Bean @Primary ccObjectPropertyNumber = new CC<number>(42);

      @Bean ccObjectMethodString(): CC<string> {
        return new CC<string>('string');
      }

      @Bean ccObjectMethodNumber(): CC<number> {
        return new CC<number>(42);
      }

      @Bean ccObjectArrowFunctionString = () => new CC<string>('string');
      @Bean ccObjectArrowFunctionNumber = () => new CC<number>(42);
      ccObjectConstructorString = Bean(CC<string>);
      ccObjectConstructorNumber = Bean(CC<number>);

      dependencyHolder = Bean(DependencyHolder);

      @PostConstruct
      postConstruct(
        ta_string: TA<string>,
        tb_string: TB<string>,
        tb_ta_string: TB<string> & TA<string>,
        tc_string: TC<string>,
        tc_tb_string: TC<string> & TB<string>,
        tc_ta_string: TC<string> & TA<string>,
        tc_tb_ta_string: TC<string> & TB<string> & TA<string>,
        ta_number: TA<number>,
        tb_number: TB<number>,
        tb_ta_number: TB<number> & TA<number>,
        tc_number: TC<number>,
        tc_tb_number: TC<number> & TB<number>,
        tc_ta_number: TC<number> & TA<number>,
        tc_tb_ta_number: TC<number> & TB<number> & TA<number>,
        tcObjectPropertyString: TC<string>,
        tcObjectPropertyNumber: TC<number>,
        tcObjectMethodString: TC<string>,
        tcObjectMethodNumber: TC<number>,
        tcObjectArrowFunctionString: TC<string>,
        tcObjectArrowFunctionNumber: TC<number>,
        ia_string: IA<string>,
        ib_string: IB<string>,
        ib_ia_string: IB<string> & IA<string>,
        ic_string: IC<string>,
        ic_ib_string: IC<string> & IB<string>,
        ic_ia_string: IC<string> & IA<string>,
        ic_ib_ia_string: IC<string> & IB<string> & IA<string>,
        ia_number: IA<number>,
        ib_number: IB<number>,
        ib_ia_number: IB<number> & IA<number>,
        ic_number: IC<number>,
        ic_ib_number: IC<number> & IB<number>,
        ic_ia_number: IC<number> & IA<number>,
        ic_ib_ia_number: IC<number> & IB<number> & IA<number>,
        icObjectPropertyString: IC<string>,
        icObjectPropertyNumber: IC<number>,
        icObjectMethodString: IC<string>,
        icObjectMethodNumber: IC<number>,
        icObjectArrowFunctionString: IC<string>,
        icObjectArrowFunctionNumber: IC<number>,
        ca_string: CA<string>,
        cb_string: CB<string>,
        cb_ca_string: CB<string> & CA<string>,
        cc_string: CC<string>,
        cc_cb_string: CC<string> & CB<string>,
        cc_ca_string: CC<string> & CA<string>,
        cc_cb_ca_string: CC<string> & CB<string> & CA<string>,
        ca_number: CA<number>,
        cb_number: CB<number>,
        cb_ca_number: CB<number> & CA<number>,
        cc_number: CC<number>,
        cc_cb_number: CC<number> & CB<number>,
        cc_ca_number: CC<number> & CA<number>,
        cc_cb_ca_number: CC<number> & CB<number> & CA<number>,
        ccObjectPropertyString: CC<string>,
        ccObjectPropertyNumber: CC<number>,
        ccObjectMethodString: CC<string>,
        ccObjectMethodNumber: CC<number>,
        ccObjectArrowFunctionString: CC<string>,
        ccObjectArrowFunctionNumber: CC<number>,
        ccObjectConstructorString: CC<string>,
        ccObjectConstructorNumber: CC<number>,
      ) {
        postConstructSpy({
          ta_string,
          tb_string,
          tb_ta_string,
          tc_string,
          tc_tb_string,
          tc_ta_string,
          tc_tb_ta_string,
          ta_number,
          tb_number,
          tb_ta_number,
          tc_number,
          tc_tb_number,
          tc_ta_number,
          tc_tb_ta_number,
          tcObjectPropertyString,
          tcObjectPropertyNumber,
          tcObjectMethodString,
          tcObjectMethodNumber,
          tcObjectArrowFunctionString,
          tcObjectArrowFunctionNumber,
          ia_string,
          ib_string,
          ib_ia_string,
          ic_string,
          ic_ib_string,
          ic_ia_string,
          ic_ib_ia_string,
          ia_number,
          ib_number,
          ib_ia_number,
          ic_number,
          ic_ib_number,
          ic_ia_number,
          ic_ib_ia_number,
          icObjectPropertyString,
          icObjectPropertyNumber,
          icObjectMethodString,
          icObjectMethodNumber,
          icObjectArrowFunctionString,
          icObjectArrowFunctionNumber,
          ca_string,
          cb_string,
          cb_ca_string,
          cc_string,
          cc_cb_string,
          cc_ca_string,
          cc_cb_ca_string,
          ca_number,
          cb_number,
          cb_ca_number,
          cc_number,
          cc_cb_number,
          cc_ca_number,
          cc_cb_ca_number,
          ccObjectPropertyString,
          ccObjectPropertyNumber,
          ccObjectMethodString,
          ccObjectMethodNumber,
          ccObjectArrowFunctionString,
          ccObjectArrowFunctionNumber,
          ccObjectConstructorString,
          ccObjectConstructorNumber,
        });
      }

      @PreDestroy
      preDestroy(
        ta_string: TA<string>,
        tb_string: TB<string>,
        tb_ta_string: TB<string> & TA<string>,
        tc_string: TC<string>,
        tc_tb_string: TC<string> & TB<string>,
        tc_ta_string: TC<string> & TA<string>,
        tc_tb_ta_string: TC<string> & TB<string> & TA<string>,
        ta_number: TA<number>,
        tb_number: TB<number>,
        tb_ta_number: TB<number> & TA<number>,
        tc_number: TC<number>,
        tc_tb_number: TC<number> & TB<number>,
        tc_ta_number: TC<number> & TA<number>,
        tc_tb_ta_number: TC<number> & TB<number> & TA<number>,
        tcObjectPropertyString: TC<string>,
        tcObjectPropertyNumber: TC<number>,
        tcObjectMethodString: TC<string>,
        tcObjectMethodNumber: TC<number>,
        tcObjectArrowFunctionString: TC<string>,
        tcObjectArrowFunctionNumber: TC<number>,
        ia_string: IA<string>,
        ib_string: IB<string>,
        ib_ia_string: IB<string> & IA<string>,
        ic_string: IC<string>,
        ic_ib_string: IC<string> & IB<string>,
        ic_ia_string: IC<string> & IA<string>,
        ic_ib_ia_string: IC<string> & IB<string> & IA<string>,
        ia_number: IA<number>,
        ib_number: IB<number>,
        ib_ia_number: IB<number> & IA<number>,
        ic_number: IC<number>,
        ic_ib_number: IC<number> & IB<number>,
        ic_ia_number: IC<number> & IA<number>,
        ic_ib_ia_number: IC<number> & IB<number> & IA<number>,
        icObjectPropertyString: IC<string>,
        icObjectPropertyNumber: IC<number>,
        icObjectMethodString: IC<string>,
        icObjectMethodNumber: IC<number>,
        icObjectArrowFunctionString: IC<string>,
        icObjectArrowFunctionNumber: IC<number>,
        ca_string: CA<string>,
        cb_string: CB<string>,
        cb_ca_string: CB<string> & CA<string>,
        cc_string: CC<string>,
        cc_cb_string: CC<string> & CB<string>,
        cc_ca_string: CC<string> & CA<string>,
        cc_cb_ca_string: CC<string> & CB<string> & CA<string>,
        ca_number: CA<number>,
        cb_number: CB<number>,
        cb_ca_number: CB<number> & CA<number>,
        cc_number: CC<number>,
        cc_cb_number: CC<number> & CB<number>,
        cc_ca_number: CC<number> & CA<number>,
        cc_cb_ca_number: CC<number> & CB<number> & CA<number>,
        ccObjectPropertyString: CC<string>,
        ccObjectPropertyNumber: CC<number>,
        ccObjectMethodString: CC<string>,
        ccObjectMethodNumber: CC<number>,
        ccObjectArrowFunctionString: CC<string>,
        ccObjectArrowFunctionNumber: CC<number>,
        ccObjectConstructorString: CC<string>,
        ccObjectConstructorNumber: CC<number>,
      ) {
        preDestroySpy({
          ta_string,
          tb_string,
          tb_ta_string,
          tc_string,
          tc_tb_string,
          tc_ta_string,
          tc_tb_ta_string,
          ta_number,
          tb_number,
          tb_ta_number,
          tc_number,
          tc_tb_number,
          tc_ta_number,
          tc_tb_ta_number,
          tcObjectPropertyString,
          tcObjectPropertyNumber,
          tcObjectMethodString,
          tcObjectMethodNumber,
          tcObjectArrowFunctionString,
          tcObjectArrowFunctionNumber,
          ia_string,
          ib_string,
          ib_ia_string,
          ic_string,
          ic_ib_string,
          ic_ia_string,
          ic_ib_ia_string,
          ia_number,
          ib_number,
          ib_ia_number,
          ic_number,
          ic_ib_number,
          ic_ia_number,
          ic_ib_ia_number,
          icObjectPropertyString,
          icObjectPropertyNumber,
          icObjectMethodString,
          icObjectMethodNumber,
          icObjectArrowFunctionString,
          icObjectArrowFunctionNumber,
          ca_string,
          cb_string,
          cb_ca_string,
          cc_string,
          cc_cb_string,
          cc_ca_string,
          cc_cb_ca_string,
          ca_number,
          cb_number,
          cb_ca_number,
          cc_number,
          cc_cb_number,
          cc_ca_number,
          cc_cb_ca_number,
          ccObjectPropertyString,
          ccObjectPropertyNumber,
          ccObjectMethodString,
          ccObjectMethodNumber,
          ccObjectArrowFunctionString,
          ccObjectArrowFunctionNumber,
          ccObjectConstructorString,
          ccObjectConstructorNumber,
        });
      }


      exposed = ExposeBeans<{ dependencyHolder: DependencyHolder }>();
    }

    const expectedObjectLifecycle = {
      ta_string: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 'string'
      },
      tb_string: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 'string'
      },
      tb_ta_string: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 'string'
      },
      tc_string: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 'string'
      },
      tc_tb_string: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 'string'
      },
      tc_ta_string: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 'string'
      },
      tc_tb_ta_string: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 'string'
      },
      ta_number: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 42
      },
      tb_number: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 42
      },
      tb_ta_number: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 42
      },
      tc_number: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 42
      },
      tc_tb_number: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 42
      },
      tc_ta_number: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 42
      },
      tc_tb_ta_number: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 42
      },
      tcObjectPropertyString: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 'string'
      },
      tcObjectPropertyNumber: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 42
      },
      tcObjectMethodString: {
        tc: true,
        counterC: 1,
        tb: true,
        counterB: 1,
        ta: true,
        counterA: 1,
        data: 'string'
      },
      tcObjectMethodNumber: {
        tc: true,
        counterC: 1,
        tb: true,
        counterB: 1,
        ta: true,
        counterA: 1,
        data: 42
      },
      tcObjectArrowFunctionString: {
        tc: true,
        counterC: 2,
        tb: true,
        counterB: 2,
        ta: true,
        counterA: 2,
        data: 'string'
      },
      tcObjectArrowFunctionNumber: {
        tc: true,
        counterC: 2,
        tb: true,
        counterB: 2,
        ta: true,
        counterA: 2,
        data: 42
      },
      ia_string: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 'string'
      },
      ib_string: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 'string'
      },
      ib_ia_string: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 'string'
      },
      ic_string: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 'string'
      },
      ic_ib_string: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 'string'
      },
      ic_ia_string: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 'string'
      },
      ic_ib_ia_string: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 'string'
      },
      ia_number: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 42
      },
      ib_number: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 42
      },
      ib_ia_number: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 42
      },
      ic_number: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 42
      },
      ic_ib_number: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 42
      },
      ic_ia_number: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 42
      },
      ic_ib_ia_number: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 42
      },
      icObjectPropertyString: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 'string'
      },
      icObjectPropertyNumber: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 42
      },
      icObjectMethodString: {
        ic: true,
        counterC: 1,
        ib: true,
        counterB: 1,
        ia: true,
        counterA: 1,
        data: 'string'
      },
      icObjectMethodNumber: {
        ic: true,
        counterC: 1,
        ib: true,
        counterB: 1,
        ia: true,
        counterA: 1,
        data: 42
      },
      icObjectArrowFunctionString: {
        ic: true,
        counterC: 2,
        ib: true,
        counterB: 2,
        ia: true,
        counterA: 2,
        data: 'string'
      },
      icObjectArrowFunctionNumber: {
        ic: true,
        counterC: 2,
        ib: true,
        counterB: 2,
        ia: true,
        counterA: 2,
        data: 42
      },
      ca_string: {
        data: 'string',
        ca: true,
        counterA: 0,
        cb: true,
        counterB: 0,
        cc: true,
        counterC: 0
      },
      cb_string: {
        data: 'string',
        ca: true,
        counterA: 0,
        cb: true,
        counterB: 0,
        cc: true,
        counterC: 0
      },
      cb_ca_string: {
        data: 'string',
        ca: true,
        counterA: 0,
        cb: true,
        counterB: 0,
        cc: true,
        counterC: 0
      },
      cc_string: {
        data: 'string',
        ca: true,
        counterA: 0,
        cb: true,
        counterB: 0,
        cc: true,
        counterC: 0
      },
      cc_cb_string: {
        data: 'string',
        ca: true,
        counterA: 0,
        cb: true,
        counterB: 0,
        cc: true,
        counterC: 0
      },
      cc_ca_string: {
        data: 'string',
        ca: true,
        counterA: 0,
        cb: true,
        counterB: 0,
        cc: true,
        counterC: 0
      },
      cc_cb_ca_string: {
        data: 'string',
        ca: true,
        counterA: 0,
        cb: true,
        counterB: 0,
        cc: true,
        counterC: 0
      },
      ca_number: {
        data: 42,
        ca: true,
        counterA: 1,
        cb: true,
        counterB: 1,
        cc: true,
        counterC: 1
      },
      cb_number: {
        data: 42,
        ca: true,
        counterA: 1,
        cb: true,
        counterB: 1,
        cc: true,
        counterC: 1
      },
      cb_ca_number: {
        data: 42,
        ca: true,
        counterA: 1,
        cb: true,
        counterB: 1,
        cc: true,
        counterC: 1
      },
      cc_number: {
        data: 42,
        ca: true,
        counterA: 1,
        cb: true,
        counterB: 1,
        cc: true,
        counterC: 1
      },
      cc_cb_number: {
        data: 42,
        ca: true,
        counterA: 1,
        cb: true,
        counterB: 1,
        cc: true,
        counterC: 1
      },
      cc_ca_number: {
        data: 42,
        ca: true,
        counterA: 1,
        cb: true,
        counterB: 1,
        cc: true,
        counterC: 1
      },
      cc_cb_ca_number: {
        data: 42,
        ca: true,
        counterA: 1,
        cb: true,
        counterB: 1,
        cc: true,
        counterC: 1
      },
      ccObjectPropertyString: {
        data: 'string',
        ca: true,
        counterA: 0,
        cb: true,
        counterB: 0,
        cc: true,
        counterC: 0
      },
      ccObjectPropertyNumber: {
        data: 42,
        ca: true,
        counterA: 1,
        cb: true,
        counterB: 1,
        cc: true,
        counterC: 1
      },
      ccObjectMethodString: {
        data: 'string',
        ca: true,
        counterA: 2,
        cb: true,
        counterB: 2,
        cc: true,
        counterC: 2
      },
      ccObjectMethodNumber: {
        data: 42,
        ca: true,
        counterA: 3,
        cb: true,
        counterB: 3,
        cc: true,
        counterC: 3
      },
      ccObjectArrowFunctionString: {
        data: 'string',
        ca: true,
        counterA: 4,
        cb: true,
        counterB: 4,
        cc: true,
        counterC: 4
      },
      ccObjectArrowFunctionNumber: {
        data: 42,
        ca: true,
        counterA: 5,
        cb: true,
        counterB: 5,
        cc: true,
        counterC: 5
      },
      ccObjectConstructorString: {
        data: 'string',
        ca: true,
        counterA: 6,
        cb: true,
        counterB: 6,
        cc: true,
        counterC: 6
      },
      ccObjectConstructorNumber: {
        data: 42,
        ca: true,
        counterA: 7,
        cb: true,
        counterB: 7,
        cc: true,
        counterC: 7
      }
    };
    const expectedObject = {
      ta_string: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 'string'
      },
      tb_string: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 'string'
      },
      tb_ta_string: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 'string'
      },
      tc_string: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 'string'
      },
      tc_tb_string: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 'string'
      },
      tc_ta_string: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 'string'
      },
      tc_tb_ta_string: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 'string'
      },
      ta_number: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 42
      },
      tb_number: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 42
      },
      tb_ta_number: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 42
      },
      tc_number: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 42
      },
      tc_tb_number: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 42
      },
      tc_ta_number: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 42
      },
      tc_tb_ta_number: {
        tc: true,
        counterC: 0,
        tb: true,
        counterB: 0,
        ta: true,
        counterA: 0,
        data: 42
      },
      ia_string: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 'string'
      },
      ib_string: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 'string'
      },
      ib_ia_string: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 'string'
      },
      ic_string: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 'string'
      },
      ic_ib_string: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 'string'
      },
      ic_ia_string: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 'string'
      },
      ic_ib_ia_string: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 'string'
      },
      ia_number: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 42
      },
      ib_number: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 42
      },
      ib_ia_number: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 42
      },
      ic_number: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 42
      },
      ic_ib_number: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 42
      },
      ic_ia_number: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 42
      },
      ic_ib_ia_number: {
        ic: true,
        counterC: 0,
        ib: true,
        counterB: 0,
        ia: true,
        counterA: 0,
        data: 42
      },
      ca_string: {
        data: 'string',
        ca: true,
        counterA: 0,
        cb: true,
        counterB: 0,
        cc: true,
        counterC: 0
      },
      cb_string: {
        data: 'string',
        ca: true,
        counterA: 0,
        cb: true,
        counterB: 0,
        cc: true,
        counterC: 0
      },
      cb_ca_string: {
        data: 'string',
        ca: true,
        counterA: 0,
        cb: true,
        counterB: 0,
        cc: true,
        counterC: 0
      },
      cc_string: {
        data: 'string',
        ca: true,
        counterA: 0,
        cb: true,
        counterB: 0,
        cc: true,
        counterC: 0
      },
      cc_cb_string: {
        data: 'string',
        ca: true,
        counterA: 0,
        cb: true,
        counterB: 0,
        cc: true,
        counterC: 0
      },
      cc_ca_string: {
        data: 'string',
        ca: true,
        counterA: 0,
        cb: true,
        counterB: 0,
        cc: true,
        counterC: 0
      },
      cc_cb_ca_string: {
        data: 'string',
        ca: true,
        counterA: 0,
        cb: true,
        counterB: 0,
        cc: true,
        counterC: 0
      },
      ca_number: {
        data: 42,
        ca: true,
        counterA: 1,
        cb: true,
        counterB: 1,
        cc: true,
        counterC: 1
      },
      cb_number: {
        data: 42,
        ca: true,
        counterA: 1,
        cb: true,
        counterB: 1,
        cc: true,
        counterC: 1
      },
      cb_ca_number: {
        data: 42,
        ca: true,
        counterA: 1,
        cb: true,
        counterB: 1,
        cc: true,
        counterC: 1
      },
      cc_number: {
        data: 42,
        ca: true,
        counterA: 1,
        cb: true,
        counterB: 1,
        cc: true,
        counterC: 1
      },
      cc_cb_number: {
        data: 42,
        ca: true,
        counterA: 1,
        cb: true,
        counterB: 1,
        cc: true,
        counterC: 1
      },
      cc_ca_number: {
        data: 42,
        ca: true,
        counterA: 1,
        cb: true,
        counterB: 1,
        cc: true,
        counterC: 1
      },
      cc_cb_ca_number: {
        data: 42,
        ca: true,
        counterA: 1,
        cb: true,
        counterB: 1,
        cc: true,
        counterC: 1
      }
    };

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);
    const dependencyHolder = await application.getExposedBean('dependencyHolder');

    //Then
    expect(postConstructSpy.firstCall.firstArg).toEqual(expectedObjectLifecycle);

    expect(postConstructSpy.calledOnce).toBe(true);
    expect(preDestroySpy.notCalled).toBe(true);

    expect(dependencyHolder).toEqual(expectedObject);

    await application.destroy();

    expect(postConstructSpy.calledOnce).toBe(true);
    expect(preDestroySpy.firstCall.firstArg).toEqual(expectedObjectLifecycle);
  });
});
