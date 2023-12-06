import { Bean, CatContext, ContainerManager, RuntimeErrors } from '@clawject/di';

describe('ContainerManager', () => {
  describe('init', () => {
    it('should init context without keys', () => {
      //Given
      class ApplicationContext extends CatContext {}

      //When
      const initializedContext = ContainerManager.init(ApplicationContext);

      //Then
      expect(initializedContext).toBe(ContainerManager.get(ApplicationContext));
    });

    it('should init context with keys', () => {
      //Given
      class ApplicationContext extends CatContext {}

      const key = Symbol();

      //When
      const initializedContext = ContainerManager.init(ApplicationContext, {key});

      //Then
      expect(initializedContext).toBe(ContainerManager.get(ApplicationContext, key));
    });

    it('should init context with config', () => {
      //Given
      interface Config {
        data: string;
      }

      class ApplicationContext extends CatContext<{ configDataValue: string }, Config> {
        @Bean configDataValue = this.config.data;
      }

      const config: Config = {
        data: 'dataValue'
      };

      //When
      const initializedContext = ContainerManager.init(
        ApplicationContext,
        {config}
      );

      //Then
      expect(initializedContext.getBean('configDataValue')).toBe(config.data);
    });

    it('should init context with key config', () => {
      //Given
      interface Config {
        data: string;
      }

      class ApplicationContext extends CatContext<{ configDataValue: string }, Config> {
        @Bean configDataValue = this.config.data;
      }

      const key = Symbol();
      const config: Config = {
        data: 'dataValue'
      };

      //When
      const initializedContext = ContainerManager.init(
        ApplicationContext,
        {key, config}
      );

      //Then
      expect(initializedContext.getBean('configDataValue')).toBe(config.data);
    });
  });

  describe('get', () => {
    it('should get already initialized context', () => {
      //Given
      class ApplicationContext extends CatContext {}

      const initializedContext = ContainerManager.init(ApplicationContext);

      //When
      const context = ContainerManager.get(ApplicationContext);

      //Then
      expect(context).toBe(initializedContext);
    });

    it('should get already initialized context by key', () => {
      //Given
      class ApplicationContext extends CatContext {}
      const key = Symbol();

      const initializedContext = ContainerManager.init(ApplicationContext, { key });

      //When
      const context = ContainerManager.get(ApplicationContext, key);

      //Then
      expect(context).toBe(initializedContext);
    });

    it('should throw NoInitializedContextFoundError when can not find initialized context without key', () => {
      //Given
      class ApplicationContext extends CatContext {}
      const expectedError = new RuntimeErrors.NoInitializedContextFoundError(
        'Context \'ApplicationContext\' was not initialized, initialization key is attached to this error object',
        undefined
      );

      //When - Then
      expect(() => ContainerManager.get(ApplicationContext)).toThrow(expectedError);
    });

    it('should throw NoInitializedContextFoundError when can not find initialized context by key', () => {
      //Given
      class ApplicationContext extends CatContext {}
      const key = Symbol();
      const expectedError = new RuntimeErrors.NoInitializedContextFoundError(
        'Context \'ApplicationContext\' was not initialized, initialization key is attached to this error object',
        key
      );

      //When - Then
      expect(() => ContainerManager.get(ApplicationContext, key)).toThrow(expectedError);
    });
  });

  describe('getOrInit', () => {
    it('should init context and get it after initialization without key', () => {
      //Given
      class ApplicationContext extends CatContext {}

      //When
      const context = ContainerManager.getOrInit(ApplicationContext);

      //Then
      const expected = ContainerManager.getOrInit(ApplicationContext);

      expect(context).toBe(expected);
    });

    it('should init context and get it after initialization with key', () => {
      //Given
      class ApplicationContext extends CatContext {}
      const key = Symbol();

      //When
      const context = ContainerManager.getOrInit(ApplicationContext, { key });

      //Then
      const expected = ContainerManager.getOrInit(ApplicationContext, { key });

      expect(context).toBe(expected);
    });

    it('should get initialized context', () => {
      //Given
      class ApplicationContext extends CatContext {}

      const initializedContext = ContainerManager.init(ApplicationContext);

      //When
      const context = ContainerManager.getOrInit(ApplicationContext);

      //Then
      expect(context).toBe(initializedContext);
    });

    it('should get initialized context with key', () => {
      //Given
      class ApplicationContext extends CatContext {}
      const key = Symbol();

      const initializedContext = ContainerManager.init(ApplicationContext, { key });

      //When
      const context = ContainerManager.getOrInit(ApplicationContext, { key });

      //Then
      expect(context).toBe(initializedContext);
    });
  });

  describe('destroy', () => {
    it('should destroy context', () => {
      //Given
      let instantiationsCounter = 0;
      class ApplicationContext extends CatContext {
        constructor() {
          super();
          instantiationsCounter++;
        }
      }

      ContainerManager.init(ApplicationContext);

      //When - Then
      ContainerManager.destroy(ApplicationContext);
      ContainerManager.init(ApplicationContext);
      ContainerManager.destroy(ApplicationContext);

      expect(instantiationsCounter).toBe(2);
    });

    it('should destroy context by key', () => {
      //Given
      let instantiationsCounter = 0;
      class ApplicationContext extends CatContext {
        constructor() {
          super();
          instantiationsCounter++;
        }
      }
      const key = Symbol();

      ContainerManager.init(ApplicationContext, { key });

      //When - Then
      ContainerManager.destroy(ApplicationContext, key);
      ContainerManager.init(ApplicationContext, { key });
      ContainerManager.destroy(ApplicationContext, key);

      expect(instantiationsCounter).toBe(2);
    });

    it('should throw NoInitializedContextFoundError when context was not initialized', () => {
      //Given
      class ApplicationContext extends CatContext {}

      //When - Then
      expect(() => ContainerManager.destroy(ApplicationContext)).toThrow(
        new RuntimeErrors.NoInitializedContextFoundError(
          'Context \'ApplicationContext\' was not initialized, initialization key is attached to this error object',
          undefined
        )
      );
    });

    it('should throw NoInitializedContextFoundError when context was not initialized with key', () => {
      //Given
      class ApplicationContext extends CatContext {}
      const key = Symbol();

      //When - Then
      expect(() => ContainerManager.destroy(ApplicationContext, key)).toThrow(
        new RuntimeErrors.NoInitializedContextFoundError(
          'Context \'ApplicationContext\' was not initialized, initialization key is attached to this error object',
          key
        )
      );
    });
  });
});
