/**
 * SinbaService 基类
 */
import { SinbaCore } from '../core';

import { SinbaContext } from './sinba';

export class BaseService {
    /**
     * Sinba上下文
     */
    public ctx: SinbaContext;

    /**
     * Sinba Application
     */
    public app: SinbaCore;

    constructor(context: SinbaContext) {
        this.ctx = context;
        this.app = context.app;
    }
}
