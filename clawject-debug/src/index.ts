import { Bean, ClawjectApplication, Import } from '@clawject/di';
import { A } from "./A";

@ClawjectApplication
class App {
 a = Import(A);
}
