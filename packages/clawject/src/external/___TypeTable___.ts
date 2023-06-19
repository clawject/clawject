import type { runClawjectApplication } from './runClawjectApplication';

/**
 * This is an interface for internal usage only, it's not used in any other api of this library.
 *
 * Please don't rely on this interface in your own code.
 * */
export interface ___TypeTable___ {
    array: ReadonlyArray<any> | Array<any> | any[];
    set: ReadonlySet<any> | Set<any>;
    map: ReadonlyMap<any, any> | Map<any, any>;
    mapStringToAny: ReadonlyMap<string, any> | Map<string, any>;
    runClawjectApplication: runClawjectApplication;
}
