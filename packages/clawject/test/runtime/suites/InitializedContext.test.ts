import { Bean, CatContext, ContainerManager } from '@clawject/di';

describe('InitializedContext', () => {

  describe('getBean', () => {
    it('should return public bean by name', () => {
      //Given
      let counter= 0;
      class Foo {
        public counterValue: number;

        constructor() {
          this.counterValue = ++counter;
        }
      }

      interface ExternalBeans {
        fooProperty: Foo;
        fooFactoryMethod: Foo;
        fooFactoryArrowFunction: Foo;
        foo: Foo;
      }

      class ApplicationContext extends CatContext<ExternalBeans> {
        @Bean fooProperty = new Foo();
        @Bean fooFactoryMethod() { return new Foo(); }
        @Bean fooFactoryArrowFunction = () => new Foo();
        @Bean foo = Bean(Foo);
      }

      //When
      const context = ContainerManager.init(ApplicationContext);

      //Then
      expect(context.getBean('fooProperty')).toBeInstanceOf(Foo);
      expect(context.getBean('fooProperty').counterValue).toBe(1);
      expect(context.getBean('fooFactoryMethod')).toBeInstanceOf(Foo);
      expect(context.getBean('fooFactoryMethod').counterValue).toBe(2);
      expect(context.getBean('fooFactoryArrowFunction')).toBeInstanceOf(Foo);
      expect(context.getBean('fooFactoryArrowFunction').counterValue).toBe(3);
      expect(context.getBean('foo')).toBeInstanceOf(Foo);
      expect(context.getBean('foo').counterValue).toBe(4);
    });

    it('should return private bean by name', () => {
      //Given
      let counter= 0;
      class Foo {
        public counterValue: number;

        constructor() {
          this.counterValue = ++counter;
        }
      }

      class ApplicationContext extends CatContext {
        @Bean fooProperty = new Foo();
        @Bean fooFactoryMethod() { return new Foo(); }
        @Bean fooFactoryArrowFunction = () => new Foo();
        @Bean foo = Bean(Foo);
      }

      //When
      const context = ContainerManager.init(ApplicationContext);

      //Then
      // @ts-ignore
      expect(context.getBean('fooProperty')).toBeInstanceOf(Foo);
      // @ts-ignore
      expect(context.getBean('fooProperty').counterValue).toBe(1);
      // @ts-ignore
      expect(context.getBean('fooFactoryMethod')).toBeInstanceOf(Foo);
      // @ts-ignore
      expect(context.getBean('fooFactoryMethod').counterValue).toBe(2);
      // @ts-ignore
      expect(context.getBean('fooFactoryArrowFunction')).toBeInstanceOf(Foo);
      // @ts-ignore
      expect(context.getBean('fooFactoryArrowFunction').counterValue).toBe(3);
      // @ts-ignore
      expect(context.getBean('foo')).toBeInstanceOf(Foo);
      // @ts-ignore
      expect(context.getBean('foo').counterValue).toBe(4);
    });
  });
});
