import { Bean, Configuration, Import } from "@clawject/di";
import { C } from "./C";

@Configuration
export class B {
  c = Import(C);

  @Bean b = 'b' as const;
}
