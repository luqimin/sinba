/**
 * SinbaController 基类
 */
import { SinbaCore } from '../core';

import { SinbaContext } from './sinba';

export class BaseController {
    /**
     * Sinba上下文
     */
    public ctx: SinbaContext;

    /**
     * Sinba Application
     */
    public app: SinbaCore;

    /**
     * Sinba service
     */
    public service: any;

    constructor(context: SinbaContext) {
        this.ctx = context;
        this.app = context.app;
        this.service = context.service;
    }
}
