import { Bean, Configuration, Import } from "@clawject/di";
import { B } from "./B";

@Configuration
export class A {
  b = Import(B);

  @Bean a = 'a' as const;
}
