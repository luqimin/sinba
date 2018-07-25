/**
 * 初始化路由
 */

import * as path from 'path';
import { readFile } from '../../utils';

import { Booter } from '../index';

const initRouter = function (this: Booter) {
    readFile(path.join(this.options.baseDir, 'app/router.js'))(this.app);
};

export {
    initRouter,
};
