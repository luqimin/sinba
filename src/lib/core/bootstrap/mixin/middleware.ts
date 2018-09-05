import * as path from 'path';
import * as fs from 'fs';

import { Booter } from '../index';
import { readFile } from '../../utils';

const initMiddleware = function (this: Booter) {
    const app = this.app;
    const middlewareDirs: string[] = [
        path.join(this.options.sinbaRoot, 'app/middleware'),
        path.join(this.options.baseDir, 'app/middleware'),
    ];
    for (const middlewareDir of middlewareDirs) {
        if (fs.existsSync(middlewareDir)) {
            const middlewares = fs.readdirSync(middlewareDir);
            // 遍历middleware并且挂载在app上
            for (const middlewareFilename of middlewares) {
                const middlewareName: string = path.basename(
                    middlewareFilename,
                    '.js',
                );
                const middlewareFilepath: string = path.join(
                    middlewareDir,
                    middlewareFilename,
                );
                const middlewareFunc = readFile(middlewareFilepath);
                app.middlewares[middlewareName] = middlewareFunc;
            }
        }
    }
    // 获取middleware配置文件并运行
    const middlewareNames = [
        ...this.config.coreMiddleware,
        ...(this.config.middleware as string[]),
    ];
    const middlewaresMap = new Map();

    for (const name of middlewareNames) {
        if (!app.middlewares[name]) {
            throw new TypeError(`Middleware ${name} not found`);
        }
        if (middlewaresMap.has(name)) {
            throw new TypeError(`Middleware ${name} redefined`);
        }
        middlewaresMap.set(name, true);
        const options = this.config[name] || {};
        if (options.enable === false) {
            continue;
        }
        let mw = app.middlewares[name];
        mw = mw(options, app);
        if (mw) {
            app.use(mw);
        }
    }
};

export { initMiddleware };
