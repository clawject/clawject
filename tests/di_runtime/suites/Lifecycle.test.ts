import sinon from 'sinon';
import { Bean, ClawjectApplication, ClawjectFactory, PostConstruct, PreDestroy } from '@clawject/di';

describe('Lifecycle', () => {
  it('should run lifecycle method for beans and configurations', async () => {
    //Given
    const postConstructSpy = sinon.spy();
    const preDestroySpy = sinon.spy();

    function delay(cb: () => void, ms: number) {
      return new Promise<void>(resolve => setTimeout(() => {
        cb();
        resolve();
      }, ms));
    }

    class A {
      static counter = 0;

      constructor(
        private delay: number,
      ) {}

      @PostConstruct
      postConstruct0() {
        postConstructSpy('bean', A.counter++, 0);
      }

      @PostConstruct
      postConstruct1() {
        return delay(() => postConstructSpy('beanAsync', A.counter++, 1), this.delay);
      }

      @PreDestroy
      preDestroy0() {
        preDestroySpy('bean', A.counter++, 0);
      }

      @PreDestroy
      preDestroy1() {
        return delay(() => preDestroySpy('beanAsync', A.counter++, 1), this.delay);
      }
    }

    @ClawjectApplication
    class Application {
      static counter = 0;

      @Bean aProperty = new A(100);
      @Bean aMethod() { return new A(200); }
      @Bean aArrowFunction = () => new A(300);

      @PostConstruct
      postConstruct0() {
        postConstructSpy('application', Application.counter++, 0);
      }

      @PostConstruct
      postConstruct1() {
        return delay(() => postConstructSpy('applicationAsync', Application.counter++, 1), 400);
      }

      @PreDestroy
      preDestroy0() {
        preDestroySpy('application', Application.counter++, 0);
      }

      @PreDestroy
      preDestroy1() {
        return delay(() => preDestroySpy('applicationAsync', Application.counter++, 1), 400);
      }
    }

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);

    //Then
    expect(postConstructSpy.callCount).toBe(8);
    expect(postConstructSpy.getCall(0).calledWithExactly('bean', 0, 0)).toBe(true);
    expect(postConstructSpy.getCall(1).calledWithExactly('bean', 1, 0)).toBe(true);
    expect(postConstructSpy.getCall(2).calledWithExactly('bean', 2, 0)).toBe(true);
    expect(postConstructSpy.getCall(3).calledWithExactly('beanAsync', 3, 1)).toBe(true);
    expect(postConstructSpy.getCall(4).calledWithExactly('beanAsync', 4, 1)).toBe(true);
    expect(postConstructSpy.getCall(5).calledWithExactly('beanAsync', 5, 1)).toBe(true);
    expect(postConstructSpy.getCall(6).calledWithExactly('application', 0, 0)).toBe(true);
    expect(postConstructSpy.getCall(7).calledWithExactly('applicationAsync', 1, 1)).toBe(true);

    expect(preDestroySpy.notCalled).toBe(true);

    await application.destroy();

    expect(preDestroySpy.callCount).toBe(8);
    expect(preDestroySpy.getCall(0).calledWithExactly('application', 2, 0)).toBe(true);
    expect(preDestroySpy.getCall(1).calledWithExactly('applicationAsync', 3, 1)).toBe(true);

    expect(preDestroySpy.getCall(2).calledWithExactly('bean', 6, 0)).toBe(true);
    expect(preDestroySpy.getCall(3).calledWithExactly('bean', 7, 0)).toBe(true);
    expect(preDestroySpy.getCall(4).calledWithExactly('bean', 8, 0)).toBe(true);
    expect(preDestroySpy.getCall(5).calledWithExactly('beanAsync', 9, 1)).toBe(true);
    expect(preDestroySpy.getCall(6).calledWithExactly('beanAsync', 10, 1)).toBe(true);
    expect(preDestroySpy.getCall(7).calledWithExactly('beanAsync', 11, 1)).toBe(true);

    expect(postConstructSpy.callCount).toBe(8);
  });
});
