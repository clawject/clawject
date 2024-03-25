import sinon from 'sinon';
import { Bean, ClawjectApplication, ClawjectFactory, PostConstruct, PreDestroy } from '@clawject/di';

describe('Lifecycle', () => {
  it('should run lifecycle method for beans and configurations', async () => {
    //Given
    const postConstructSpy = sinon.spy();
    const preDestroySpy = sinon.spy();

    class A {
      static counter = 0;

      @PostConstruct
      postConstruct0() {
        postConstructSpy('bean', A.counter++, 0);
      }

      @PostConstruct
      postConstruct1() {
        postConstructSpy('bean', A.counter++, 1);
      }

      @PreDestroy
      preDestroy0() {
        preDestroySpy('bean', A.counter++, 0);
      }

      @PreDestroy
      preDestroy1() {
        preDestroySpy('bean', A.counter++, 1);
      }
    }

    @ClawjectApplication
    class Application {
      static counter = 0;

      @Bean aProperty = new A();
      @Bean aMethod() { return new A(); }
      @Bean aArrowFunction = () => new A();

      @PostConstruct
      postConstruct0() {
        postConstructSpy('application', Application.counter++, 0);
      }

      @PostConstruct
      postConstruct1() {
        postConstructSpy('application', Application.counter++, 1);
      }

      @PreDestroy
      preDestroy0() {
        preDestroySpy('application', Application.counter++, 0);
      }

      @PreDestroy
      preDestroy1() {
        preDestroySpy('application', Application.counter++, 1);
      }
    }

    //When
    const application = await ClawjectFactory.createApplicationContext(Application);

    //Then
    expect(postConstructSpy.callCount).toBe(8);
    expect(postConstructSpy.getCall(0).calledWithExactly('bean', 0, 0)).toBe(true);
    expect(postConstructSpy.getCall(1).calledWithExactly('bean', 1, 1)).toBe(true);
    expect(postConstructSpy.getCall(2).calledWithExactly('bean', 2, 0)).toBe(true);
    expect(postConstructSpy.getCall(3).calledWithExactly('bean', 3, 1)).toBe(true);
    expect(postConstructSpy.getCall(4).calledWithExactly('bean', 4, 0)).toBe(true);
    expect(postConstructSpy.getCall(5).calledWithExactly('bean', 5, 1)).toBe(true);
    expect(postConstructSpy.getCall(6).calledWithExactly('application', 0, 0)).toBe(true);
    expect(postConstructSpy.getCall(7).calledWithExactly('application', 1, 1)).toBe(true);

    expect(preDestroySpy.notCalled).toBe(true);

    await application.destroy();

    expect(preDestroySpy.callCount).toBe(8);
    expect(preDestroySpy.getCall(0).calledWithExactly('application', 2, 0)).toBe(true);
    expect(preDestroySpy.getCall(1).calledWithExactly('application', 3, 1)).toBe(true);

    expect(preDestroySpy.getCall(2).calledWithExactly('bean', 6, 0)).toBe(true);
    expect(preDestroySpy.getCall(3).calledWithExactly('bean', 7, 1)).toBe(true);
    expect(preDestroySpy.getCall(4).calledWithExactly('bean', 8, 0)).toBe(true);
    expect(preDestroySpy.getCall(5).calledWithExactly('bean', 9, 1)).toBe(true);
    expect(preDestroySpy.getCall(6).calledWithExactly('bean', 10, 0)).toBe(true);
    expect(preDestroySpy.getCall(7).calledWithExactly('bean', 11, 1)).toBe(true);

    expect(postConstructSpy.callCount).toBe(8);
  });
});
