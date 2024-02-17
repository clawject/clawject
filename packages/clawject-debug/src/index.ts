class Test {
  source: F<string> = {} as any;
  target: B<string> = {} as any;
}

type F<T> = A<T> & B<T>
interface A<T> {}
interface B<T> {}
