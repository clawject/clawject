import { Bean, Configuration, PostConstruct } from "@clawject/di";

@Configuration
export class C {
  @Bean c = 'cc' as const;

  @PostConstruct
  pc(
    allBeans: Set<string>,
    data: 'cc'
  ) {
    console.log(allBeans);
    console.log(data)
  }
}

console.log('C.ts');
