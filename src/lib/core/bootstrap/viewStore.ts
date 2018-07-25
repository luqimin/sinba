/**
 * 存储view模板
 */

export interface Cache {
    [key: string]: string;
}

export interface Store {
    _cache: Cache;
    add(key: string, value: string): void;
    get(key: string): string;
}

export const viewStore: Store = {
    _cache: {},
    add(key, value) {
        this._cache[key] = value;
    },
    get(key) {
        return this._cache[key];
    },
};
