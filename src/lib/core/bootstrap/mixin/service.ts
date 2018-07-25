/**
 * 初始化Service
 */

import * as path from 'path';
import * as fs from 'fs';

import { readFile } from '../../utils';
import { BaseService } from '../../core';
import { Booter } from '../index';

import { SinbaContext } from '../../base/sinba';

/**
 * ServiceWrapper
 * from eggjs
 */
class ServiceWrapper {
    public _cache: Map<string, any>;
    public _ctx: SinbaContext;
    constructor(options: {
        ctx: SinbaContext;
        properties: { [key: string]: any };
    }) {
        const properties = options.properties;
        this._cache = new Map();
        this._ctx = options.ctx;
        for (const property in properties) {
            this.defineProperty(property, properties[property]);
        }
    }

    private defineProperty(property: string, values: any) {
        Object.defineProperty(this, property, {
            get(this: ServiceWrapper) {
                let instance = (this._cache as Map<string, any>).get(property);
                if (!instance) {
                    instance = getInstance(values, this._ctx);
                    this._cache.set(property, instance);
                }
                return instance;
            },
        });
    }
}

/**
 * 获取Service实例
 */
const getInstance = (ServiceClass: any, ctx: SinbaContext) => {
    return new ServiceClass(ctx);
};

/**
 * ctx.service缓存
 */
let _serviceCache: ServiceWrapper;

const initService = function (this: Booter) {
    try {
        const service: any = (this.app.service = this.app.context.service = {});
        const serviceDir: string = path.join(
            this.options.baseDir,
            'app/service',
        );
        const services: string[] = fs.readdirSync(serviceDir);

        const properties: { [key: string]: any } = {};
        for (const serviceFilename of services) {
            const serviceName: string = path.basename(serviceFilename, '.js');
            const serviceFilepath: string = path.join(
                serviceDir,
                serviceFilename,
            );
            const ServiceClass: typeof BaseService = readFile(serviceFilepath);

            properties[serviceName] = ServiceClass;
        }

        Object.defineProperty(this.app.context, 'service', {
            get(this: SinbaContext): ServiceWrapper {
                if (_serviceCache) {
                    return _serviceCache;
                }
                const instance = (_serviceCache = new ServiceWrapper({
                    ctx: this,
                    properties,
                }));
                return instance;
            },
        });
    } catch (error) {
        throw error;
    }
};

export { initService };
