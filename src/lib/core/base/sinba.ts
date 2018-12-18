import { BaseContext } from 'koa';
import { SinbaCore } from '../core';

interface SinbaContext extends BaseContext {
    [key: string]: any;
    app: SinbaCore;
}

export { SinbaContext };
