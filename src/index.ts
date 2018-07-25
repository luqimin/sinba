import { Server } from 'http';
import {
    SinbaCore,
    SinbaOptions,
    BaseController as Controller,
    BaseService as Service,
} from './lib/core/core';

class Application extends SinbaCore {

    /**
     * Sinba启动的http服务
     */
    private _server: Server;

    constructor(options?: SinbaOptions) {
        super(options);

        this.logger.log('Sinba initing...');
        this.init();
        this.logger.log('Sinba inited!');
        this.logger.name('sinba').logbook('Sinba inited!');
    }

    /**
     * 启动服务
     */
    public start(): Server {
        this.logger.log(`Sinba server start on port ${this.options.port}`);

        this._server = this.listen(this.options.port);
        return this._server;
    }

    /**
     * 销毁服务
     */
    public close() {
        this.logger.log('Sinba application destroying...');
        this.logger.name('sinba').logbook('Sinba destroying...');

        // 关闭server服务
        this._server.close(() => {
            this.logger.log('Sinba application destroyed');
            this.logger.name('sinba').logbook('Sinba destroyed!');
            // 关闭定时任务
            this.schedule.cancelAll();
        });
    }

    /**
     * Sinba初始化
     */
    private init() {
        // 初始化service
        this.bootstrap.initService();

        // 初始化controller
        this.bootstrap.initController();

        // 初始化中间件
        this.bootstrap.initMiddleware();

        // 初始化路由
        this.bootstrap.initRouter();
        this.use(this.router.routes());

        // 初始化页面渲染引擎
        this.bootstrap.initView();
    }
}

export {
    Application,
    Controller,
    Service,
};
