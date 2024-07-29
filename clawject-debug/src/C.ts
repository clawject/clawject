import { Bean, Configuration } from "@clawject/di";

@Configuration
export class C {
  @Bean c = 'c' as const;
}
