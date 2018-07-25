import * as logFactory from 'debug';
import { FileTask } from '../utils';

import { SinbaCore } from '../core';

import { logbook } from './logbookProfiler';

export interface LogFunctions {
    debug: logFactory.IDebugger;
    error: logFactory.IDebugger;
}

/**
 * sinba日志方法
 */
const wrapDebug = (namespace: string): LogFunctions => {
    const debug = logFactory(namespace);
    const error = logFactory(namespace);

    debug.log = console.log.bind(console);
    error.log = console.error.bind(console);

    return {
        debug,
        error,
    };
};

export class Logger {

    /**
     * Sinba Application
     */
    public app: SinbaCore;

    /**
     * 日志命名空间
     */
    public namespace: string;

    /**
     * private
     */
    private logbookFiles: { [key: string]: FileTask } = {};

    constructor(app: SinbaCore) {
        this.app = app;
        this.namespace = app.options.sin && app.options.sin.name || 'sin';
    }

    /**
     * 命名空间为sinba的debug方法
     */
    public log(str: string): void {
        wrapDebug('sinba').debug(str);
    }

    public debug(str: string): void {
        wrapDebug(this.namespace).debug(str);
    }

    public error(str: string): void {
        wrapDebug(this.namespace).error(str);
    }

    /**
     * 记录logbook文件日志
     */
    public logbook(str: string, filename: string = 'logbook'): void {
        str = `[${filename}] ${str}`;
        wrapDebug('logbook').debug(str);
        this.writeLogbookFile(filename, logbook(str));
    }

    /**
     * 设置debug命名空间或者log日志文件名(文件名会自动补全.log后缀)
     */
    public name(namespace: string): { debug(str: string): void; error(str: string): void; logbook(str: string): void } {
        const nameLogger = { namespace };
        return {
            debug: this.debug.bind(nameLogger),
            error: this.error.bind(nameLogger),
            logbook: (str) => {
                this.logbook(str, namespace);
            },
        };
    }

    /**
     * 写logbook日志文件
     */
    private writeLogbookFile(filename: string, str: string) {
        // 如果用户没有配置logbook，则不做文件写入
        if (!this.app.config.logbook) {
            return;
        }
        if (!filename.includes('.log')) {
            filename += '.log';
        }

        if (!this.logbookFiles[filename]) {
            this.logbookFiles[filename] = new FileTask({
                dirname: this.app.config.logbook.path,
                filename,
                logrotate: this.app.config.logbook.logrotate,
                dateSplit: this.app.config.logbook.dateSplit,
            });
        }
        this.logbookFiles[filename].write(str);
    }
}
