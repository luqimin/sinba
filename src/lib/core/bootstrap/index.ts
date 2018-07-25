/**
 * Sinba loader方法，用于获取Sinba运行环境及配置
 */

import { SinbaCore } from '../core';

// loaders
import * as serviceMixin from './mixin/service';
import * as controllerMixin from './mixin/controller';
import * as routerMixin from './mixin/router';
import * as middlewareMixin from './mixin/middleware';
import * as configMixin from './mixin/config';
import * as viewMixin from './mixin/view';

export interface UserConfig {
    /**
     * 中间件名
     */
    middleware?: string[];

    /**
     * logbook
     */
    logbook?: {
        path: string;
        dateSplit: boolean;
        logrotate: boolean;
    };

    [key: string]: any;
}

export interface SinbaLoaderOptions {
    /**
     * 项目根目录
     */
    baseDir: string;
    /**
     * sinba根目录
     */
    sinbaRoot: string;
    /**
     * Sinba Application
     */
    app: SinbaCore;
}

class Booter {
    /**
     * Loader参数
     */
    public options: SinbaLoaderOptions;

    /**
     * Sinba Application
     */
    public app: SinbaCore;

    /**
     * 用户配置
     */
    public config: UserConfig;

    public initService: () => void;
    public initController: () => void;
    public initRouter: () => void;
    public initMiddleware: () => void;
    public initConfig: () => void;
    public initView: () => void;

    constructor(options: SinbaLoaderOptions) {
        this.options = options;
        this.app = this.options.app;
    }
}

const loaders = [
    serviceMixin,
    controllerMixin,
    routerMixin,
    middlewareMixin,
    configMixin,
    viewMixin,
];

for (const loader of loaders) {
    Object.assign(Booter.prototype, loader);
}

export {
    Booter,
};
