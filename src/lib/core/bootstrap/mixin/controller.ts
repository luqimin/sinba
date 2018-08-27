/**
 * 初始化controller
 */

import * as path from 'path';
import * as fs from 'fs';

import { BaseController } from '../../core';
import { Booter } from '../index';
import { readFile } from '../../utils';

const wrapClass = (SrcClass: any): { [key: string]: any } => {
    let proto = SrcClass.prototype;
    const ResClass: any = {};

    while (proto !== Object.prototype) {
        const keys = Object.getOwnPropertyNames(proto);
        for (const key of keys) {
            if (key === 'constructor') {
                continue;
            }
            const d = Object.getOwnPropertyDescriptor(proto, key);
            if (typeof (d && d.value) === 'function' && !ResClass.hasOwnProperty(key)) {
                ResClass[key] = function sinbaController(...args: any[]) {
                    // 将ctx赋值给类并实例化
                    const controller: any = new SrcClass(args[0]);
                    return controller[key].call(controller, args);
                };
            }
        }
        proto = Object.getPrototypeOf(proto);
    }

    return ResClass;
};

/**
 * 支持多级目录，通过目录名级联访问
 * @param controllerPath - 当前目录
 * @param controllerRoot - controller根目录
 * @param booter - Booter
 */
const throughDirs = (controllerPath: string, controllerRoot: string, booter: Booter) => {
    const controllers: string[] = fs.readdirSync(controllerPath);
    for (const controllerFilename of controllers) {
        if (controllerFilename.startsWith('.')) {
            continue;
        }
        const _path: string = path.resolve(controllerPath, controllerFilename);
        const stat: fs.Stats = fs.statSync(_path);
        if (stat.isDirectory()) {
            throughDirs(_path, controllerRoot, booter);
        } else {
            const controllerName: string = path.basename(controllerFilename, '.js');
            const controllerFilepath: string = path.join(controllerPath, controllerFilename);
            const ControllerClass: typeof BaseController = readFile(controllerFilepath);
            const namePath: string[] = path.relative(controllerRoot, controllerPath).split(path.sep);
            let controller = booter.app.controller;
            // 计算级联目录
            for (const _name of namePath) {
                if (_name) {
                    controller = controller[_name] = controller[_name] || {};
                }
            }
            controller[controllerName] = wrapClass(ControllerClass);
        }
    }
};

const initController = function (this: Booter) {
    try {
        const controller: any = (this.app.controller = this.app.context.controller = {});
        const controllerDir: string = path.join(this.options.baseDir, 'app/controller');

        throughDirs(controllerDir, controllerDir, this);
    } catch (error) {
        throw error;
    }
};

export { initController };
