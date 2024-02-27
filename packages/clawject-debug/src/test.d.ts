declare class Foo {
}
export declare class FooConfiguration {
  foo: import('@clawject/di').BeanConstructorFactory<Foo, typeof Foo>;
  /** This field is auto-generated, editing it could lead to unexpected behavior.*/
  #___clawject_compile_time_metadata___: {
    kind: 1;
    version: 1;
    external: null;
    beans: [
      {
        kind: 2;
        primary: false;
        external: null;
        qualifier: null;
        nestedProperty: null;
        classPropertyName: 'foo';
      }
    ];
    imports: [
    ];
  };
}
