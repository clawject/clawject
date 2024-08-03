import { Bean, Configuration, Import } from "@clawject/di";
import { C } from "./C";

@Configuration
export class B {
  c = Import(C);

  @Bean b = 'bbb' as const;
}

console.log('B.ts')
