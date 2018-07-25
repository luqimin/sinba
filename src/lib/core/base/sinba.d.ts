import { BaseContext } from 'koa';

interface SinbaContext extends BaseContext {
    [key: string]: any;
}

export { SinbaContext };
