@Configuration
export class C {
  @Bean c = 'c' as const;
  @Bean abc(a: 'a', b: 'b', c: 'c'): 'abc' {
    return (a + b + c) as 'abc';
  }
}
