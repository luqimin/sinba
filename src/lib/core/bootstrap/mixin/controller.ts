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
            if ((typeof (d && d.value) === 'function') && !ResClass.hasOwnProperty(key)) {
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

const initController = function (this: Booter) {
    try {
        this.app.controller = {};
        const controllerDir: string = path.join(this.options.baseDir, 'app/controller');
        const controllers: string[] = fs.readdirSync(controllerDir);

        for (const controllerFilename of controllers) {
            const controllerName: string = path.basename(controllerFilename, '.js');
            const controllerFilepath: string = path.join(controllerDir, controllerFilename);
            const ControllerClass: typeof BaseController = readFile(controllerFilepath);
            this.app.controller[controllerName] = wrapClass(ControllerClass);
        }
    } catch (error) {
        throw error;
    }
};

export {
    initController,
};
