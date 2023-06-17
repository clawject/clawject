/**
 * This is an interface for internal usage only, it's not used in any other api of this library.
 *
 * Please don't rely on this interface in your own code.
 * */
export interface _TypeTable {
    array: ReadonlyArray<any> | Array<any> | any[];
    set: ReadonlySet<any> | Set<any>;
    map: ReadonlyMap<any, any> | Map<any, any>;
    mapStringToAny: ReadonlyMap<string, any> | Map<string, any>;
}
