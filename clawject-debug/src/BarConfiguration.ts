import { Bean, LazyConfigurationLoader } from "@clawject/di";
import { FooConfiguration } from "./FooConfiguration";

export class BarConfiguration {
  constructor() {
    console.log('BarConfiguration constructor');
  }

  bar = Bean(
    (lazyFoo: LazyConfigurationLoader<FooConfiguration>) => {
      setTimeout(() => {
        lazyFoo.load();
      }, 5000)

      console.log('BarConfiguration bar bean');
      return 42;
    }
  )
}
