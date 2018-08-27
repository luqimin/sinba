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
 * 获取Service实例
 */
const getInstance = (ServiceClass: any, ctx: SinbaContext) => {
    return new ServiceClass(ctx);
};

/**
 * ServiceWrapper
 */
class ServiceWrapper {
    public _cache: Map<string, any>;
    public _ctx: SinbaContext;
    constructor(options: { ctx: SinbaContext; serviceDir: string; properties: { [key: string]: any } }) {
        const properties = options.properties;
        this._cache = new Map();
        this._ctx = options.ctx;
        this.readProperties(properties, this);
    }

    private readProperties(properties: { [key: string]: any }, serviceContext: any) {
        for (const property in properties) {
            const value = properties[property];
            if (typeof value === 'function') {
                this.defineProperty(serviceContext, property, value);
            } else {
                serviceContext[property] = {};
                this.readProperties(value, serviceContext[property]);
            }
        }
    }

    private defineProperty = (serviceContext: any, property: string, values: any) => {
        const that = this;
        Object.defineProperty(serviceContext, property, {
            get() {
                let instance = (that._cache as Map<string, any>).get(property);
                if (!instance) {
                    instance = getInstance(values, that._ctx);
                    that._cache.set(property, instance);
                }
                return instance;
            },
        });
    }
}

// 支持多级目录，通过目录名级联访问
const throughDirs = (servicePath: string, serviceRoot: string, properties: { [key: string]: any }) => {
    const services: string[] = fs.readdirSync(servicePath);
    for (const serviceFilename of services) {
        if (serviceFilename.startsWith('.')) {
            continue;
        }
        const _path: string = path.resolve(servicePath, serviceFilename);
        const stat: fs.Stats = fs.statSync(_path);
        if (stat.isDirectory()) {
            throughDirs(_path, serviceRoot, properties);
        } else {
            const serviceName: string = path.basename(serviceFilename, '.js');
            const serviceFilepath: string = path.join(servicePath, serviceFilename);
            const ServiceClass: typeof BaseService = readFile(serviceFilepath);
            const namePath: string[] = path.relative(serviceRoot, servicePath).split(path.sep);

            let _service = properties;
            // 计算级联目录
            for (const _name of namePath) {
                if (_name) {
                    _service = _service[_name] = _service[_name] || {};
                }
            }
            _service[serviceName] = ServiceClass;
        }
    }
};

const initService = function (this: Booter) {
    try {
        const service: any = (this.app.service = this.app.context.service = {});
        const serviceDir: string = path.join(this.options.baseDir, 'app/service');

        const properties: { [key: string]: any } = {};
        throughDirs(serviceDir, serviceDir, properties);

        Object.defineProperty(this.app.context, 'service', {
            get(this: SinbaContext): ServiceWrapper {
                const instance: ServiceWrapper = new ServiceWrapper({
                    ctx: this,
                    serviceDir,
                    properties,
                });
                return instance;
            },
        });
    } catch (error) {
        throw error;
    }
};

export { initService };
