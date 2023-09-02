// import type { runClawjectApplication } from './runClawjectApplication';

import { CatContext } from './CatContext';

/**
 * This is a <b>internal</b> interface, it's not used in any other parts of this library api.
 *
 * Please <b>do not use </b> this interface in your own code because <b>it could and will be changed</b> in the future.
 * @public
 * */
export interface ___TypeReferenceTable___ {
  Array: ReadonlyArray<any> | Array<any> | readonly any[] | any[];
  Set: ReadonlySet<any> | Set<any>;
  Map: ReadonlyMap<any, any> | Map<any, any>;
  MapStringToAny: ReadonlyMap<string, any> | Map<string, any>;
  CatContext: CatContext<any, any>;
  Promise: Promise<any> | PromiseLike<any>;
  // runClawjectApplication: runClawjectApplication;
}
