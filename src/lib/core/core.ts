import * as path from 'path';
import * as Koa from 'koa';
import * as Router from 'koa-router';

import { Booter, UserConfig } from './bootstrap';
import { BaseController } from './base/controller';
import { BaseService } from './base/service';

import { SinbaContext } from './base/sinba';

import * as utils from './utils';
import { Logger } from './logger';
import { SinbaSchedule } from './schedule';

import { coreConfig, SinbaOptions } from '../config/default';

export type SinbaBooter = Booter;

export const ROUTER: unique symbol = Symbol('sinba-router');

class SinbaCore extends Koa {
    /**
     * router缓存
     */
    public [ROUTER]: Router;

    /**
     * app.controller
     */
    public controller: { [controllerName: string]: any } = {};

    /**
     * app.service
     */
    public service: any;

    /**
     * app.middleware
     */
    public middlewares: any = {};

    /**
     * Sinba.logger 日志工具
     */
    public logger: Logger;

    /**
     * Sinba.schedule 定时任务工具
     */
    public schedule: SinbaSchedule;

    /**
     * Sinba core 运行参数
     */
    public options: SinbaOptions;

    /**
     * Sinba bootstrap
     */
    public bootstrap: SinbaBooter;

    public context: SinbaContext;

    /**
     * Sinba.Controller
     */
    protected Controller: typeof BaseController;

    /**
     * Sinba.Service
     */
    protected Service: typeof BaseService;

    constructor(options?: SinbaOptions) {
        super();

        // 初始化sinba options
        this.options = Object.assign({}, coreConfig, options);

        try {
            // 将sinba实例信息写入options
            this.options.sin = utils.readFile(
                path.join(this.options.baseDir, 'package.json'),
            );
        } catch (error) {
            throw error;
        }

        // 初始化schedule
        this.initSchedule();

        // 初始化booter
        this.initBooter();

        // 初始化logger
        this.initLogger();

        // Controller
        this.Controller = BaseController;

        // Service
        this.Service = BaseService;
    }

    /**
     * 初始化schedule
     */
    private initSchedule(): void {
        this.schedule = new SinbaSchedule();
    }

    /**
     * 初始化logger
     */
    private initLogger(): void {
        this.logger = new Logger(this);
    }

    /**
     * 初始化Sinba.loader
     */
    private initBooter(): void {
        this.bootstrap = new Booter({
            app: this,
            baseDir: this.options.baseDir,
            sinbaRoot: this.options.sinbaRoot,
        });

        // 初始化sinba配置config
        this.bootstrap.initConfig();
    }

    /**
     * 获取config
     */
    get config(): UserConfig {
        return this.bootstrap.config;
    }

    /**
     * 获取router
     */
    get router(): Router {
        if (this[ROUTER]) {
            return this[ROUTER];
        }
        return (this[ROUTER] = new Router());
    }
}

export { SinbaOptions, SinbaCore, BaseController, BaseService, utils };
