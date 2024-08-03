import { ClawjectApplication, ClawjectFactory, Import } from '@clawject/di';
import { A } from "./A";
import { Test } from "./test";

console.log(Test)

@ClawjectApplication
class App {
  a = Import(A);
}

(async () => {
  await ClawjectFactory.createApplicationContext(App);
})()
