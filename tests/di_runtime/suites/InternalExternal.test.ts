import { Bean, ClawjectApplication, ClawjectFactory, Configuration, External, Import, Internal, PostConstruct } from '@clawject/di';
import sinon from 'sinon';

describe('InternalExternal', () => {

  describe('Beans', () => {
    it('should mark as Internal', async() => {
      //Given
      const importedSpy = sinon.spy();
      const applicationSpy = sinon.spy();
      class Foo {
        constructor(public name: string) {}
      }

      @Configuration
      class Imported {
        @Bean @Internal foo() {
          return new Foo('ImportedFoo');
        }

        @PostConstruct
        postConstruct(
          unnamedFoo: Foo,
        ) {
          importedSpy(unnamedFoo.name);
        }
      }

      @ClawjectApplication
      class Application {
        imported = Import(Imported);

        @Bean @Internal foo() {
          return new Foo('ApplicationFoo');
        }

        @PostConstruct
        postConstruct(
          unnamedFoo: Foo,
        ) {
          applicationSpy(unnamedFoo.name);
        }
      }

      //When
      await ClawjectFactory.createApplicationContext(Application);

      //Then
      expect(importedSpy.calledOnceWithExactly('ImportedFoo')).toBeTruthy();
      expect(applicationSpy.calledOnceWithExactly('ApplicationFoo')).toBeTruthy();
    });

    it('should mark as External', async() => {
      //Given
      const importedSpy = sinon.spy();
      const applicationSpy = sinon.spy();
      class Foo {
        constructor(public name: string) {}
      }

      @Configuration
      class Imported {
        @Bean @External importedFoo() {
          return new Foo('ImportedFoo');
        }

        @PostConstruct
        postConstruct(
          importedFoo: Foo,
          applicationFoo: Foo,
        ) {
          importedSpy(importedFoo.name);
          applicationSpy(applicationFoo.name);
        }
      }

      @ClawjectApplication
      class Application {
        imported = Import(Imported);

        @Bean @External applicationFoo() {
          return new Foo('ApplicationFoo');
        }

        @PostConstruct
        postConstruct(
          importedFoo: Foo,
          applicationFoo: Foo,
        ) {
          importedSpy(importedFoo.name);
          applicationSpy(applicationFoo.name);
        }
      }

      //When
      await ClawjectFactory.createApplicationContext(Application);

      //Then
      expect(importedSpy.calledTwice).toBe(true);
      expect(importedSpy.firstCall.calledWith('ImportedFoo')).toBe(true);
      expect(importedSpy.secondCall.calledWith('ImportedFoo')).toBe(true);

      expect(applicationSpy.calledTwice).toBe(true);
      expect(applicationSpy.firstCall.calledWith('ApplicationFoo')).toBe(true);
      expect(applicationSpy.secondCall.calledWith('ApplicationFoo')).toBe(true);
    });
  });

  describe('Imports', () => {
    it('should mark as Internal', async() => {
      //Given
      const imported1Spy = sinon.spy();
      const applicationSpy = sinon.spy();
      class Foo {
        constructor(public name: string) {}
      }

      @Configuration
      class Imported1 {
        @Bean foo() {
          return new Foo('Imported1Foo');
        }
      }

      @Configuration
      class Imported2 {
        @Internal imported1 = Import(Imported1);

        @PostConstruct
        postConstruct(
          unnamedFoo: Foo,
        ) {
          imported1Spy(unnamedFoo.name);
        }
      }

      @ClawjectApplication
      class Application {
        imported2 = Import(Imported2);

        @Bean @Internal foo() {
          return new Foo('ApplicationFoo');
        }

        @PostConstruct
        postConstruct(
          unnamedFoo: Foo,
        ) {
          applicationSpy(unnamedFoo.name);
        }
      }

      //When
      await ClawjectFactory.createApplicationContext(Application);

      //Then
      expect(imported1Spy.calledOnceWithExactly('Imported1Foo')).toBeTruthy();
      expect(applicationSpy.calledOnceWithExactly('ApplicationFoo')).toBeTruthy();
    });

    it('should mark as External', async() => {
      //Given
      const imported1Spy = sinon.spy();
      const applicationSpy = sinon.spy();
      class Foo {
        constructor(public name: string) {}
      }

      @Configuration
      class Imported1 {
        @Bean imported1Foo() {
          return new Foo('Imported1Foo');
        }
      }

      @Configuration
      class Imported2 {
        @External imported1 = Import(Imported1);
      }

      @ClawjectApplication
      class Application {
        imported2 = Import(Imported2);

        @Bean applicationFoo() {
          return new Foo('ApplicationFoo');
        }

        @PostConstruct
        postConstruct(
          imported1Foo: Foo,
          applicationFoo: Foo,
        ) {
          imported1Spy(imported1Foo.name);
          applicationSpy(applicationFoo.name);
        }
      }

      //When
      await ClawjectFactory.createApplicationContext(Application);

      //Then
      expect(imported1Spy.calledOnceWithExactly('Imported1Foo')).toBeTruthy();
      expect(applicationSpy.calledOnceWithExactly('ApplicationFoo')).toBeTruthy();
    });
  });

  describe('Classes', () => {
    it('should mark as Internal', async() => {
      //Given
      const imported1Spy = sinon.spy();
      const imported2Spy = sinon.spy();
      const applicationSpy = sinon.spy();
      class Foo {
        constructor(public name: string) {}
      }

      @Configuration
      @Internal
      class Imported1 {
        @Bean foo() {
          return new Foo('Imported1Foo');
        }

        @PostConstruct
        postConstruct(
          unnamedFoo: Foo,
        ) {
          imported1Spy(unnamedFoo.name);
        }
      }

      @Configuration
      @Internal
      class Imported2 {
        imported1 = Import(Imported1);

        @Bean foo() {
          return new Foo('Imported2Foo');
        }

        @PostConstruct
        postConstruct(
          unnamedFoo: Foo,
        ) {
          imported2Spy(unnamedFoo.name);
        }
      }

      @ClawjectApplication
      @Internal
      class Application {
        imported2 = Import(Imported2);

        @Bean foo() {
          return new Foo('ApplicationFoo');
        }

        @PostConstruct
        postConstruct(
          unnamedFoo: Foo,
        ) {
          applicationSpy(unnamedFoo.name);
        }
      }

      //When
      await ClawjectFactory.createApplicationContext(Application);

      //Then
      expect(imported1Spy.calledOnceWithExactly('Imported1Foo')).toBeTruthy();
      expect(imported2Spy.calledOnceWithExactly('Imported2Foo')).toBeTruthy();
      expect(applicationSpy.calledOnceWithExactly('ApplicationFoo')).toBeTruthy();
    });

    it('should mark as External', async() => {
      //Given
      const imported1Spy = sinon.spy();
      const imported2Spy = sinon.spy();
      const applicationSpy = sinon.spy();
      class Foo {
        constructor(public name: string) {}
      }

      @Configuration
      @External
      class Imported1 {
        @Bean imported1Foo() {
          return new Foo('Imported1Foo');
        }
      }

      @Configuration
      @External
      class Imported2 {
        imported1 = Import(Imported1);

        @Bean imported2Foo() {
          return new Foo('Imported2Foo');
        }
      }

      @ClawjectApplication
      @Internal
      class Application {
        imported2 = Import(Imported2);

        @Bean applicationFoo() {
          return new Foo('ApplicationFoo');
        }

        @PostConstruct
        postConstruct(
          imported1Foo: Foo,
          imported2Foo: Foo,
          applicationFoo: Foo,
        ) {
          imported1Spy(imported1Foo.name);
          imported2Spy(imported2Foo.name);
          applicationSpy(applicationFoo.name);
        }
      }

      //When
      await ClawjectFactory.createApplicationContext(Application);

      //Then
      expect(imported1Spy.calledOnceWithExactly('Imported1Foo')).toBeTruthy();
      expect(imported2Spy.calledOnceWithExactly('Imported2Foo')).toBeTruthy();
      expect(applicationSpy.calledOnceWithExactly('ApplicationFoo')).toBeTruthy();
    });
  });
});
