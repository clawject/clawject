// import type { runClawjectApplication } from './runClawjectApplication';

import { CatContext } from './CatContext';

/**
 * It is a <b>internal</b> interface, it's not used in any other parts of this library api.
 * It's used to store type references for the transformer on build stage.
 *
 * Please <b>do not</b> use this interface in your own code.
 * @public
 * */
export interface ___TypeReferenceTable___ {
  array: ReadonlyArray<any> | Array<any> | readonly any[] | any[];
  set: ReadonlySet<any> | Set<any>;
  map: ReadonlyMap<any, any> | Map<any, any>;
  mapStringToAny: ReadonlyMap<string, any> | Map<string, any>;
  CatContext: CatContext<any, any>;
  // runClawjectApplication: runClawjectApplication;
}
