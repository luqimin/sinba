import * as path from 'path';
import * as fs from 'fs';
import * as extend from 'extend';

import { Booter, UserConfig } from '../index';
import { readFile } from '../../utils';

const initConfig = function (this: Booter) {
    const defaultUserConfig = {
        middleware: [],
    };
    let userConfig = {};

    // 获取用户配置文件,实际工程目录
    const userConfigFile: string = path.join(this.options.baseDir, 'app/config/config.js');
    if (fs.existsSync(userConfigFile)) {
        userConfig = readFile(userConfigFile);
    }

    // 获取core配置文件,sinba工程目录
    const coreConfigFile: string = path.join(this.options.sinbaRoot, 'config/config.default.js');
    const coreConfig: UserConfig = readFile(coreConfigFile)(this);

    // this.config = Object.assign({}, coreConfig, defaultUserConfig, userConfig);
    // 深度merge默认配置和项目配置
    this.config = extend(true, {}, coreConfig, defaultUserConfig, userConfig);
};

export {
    initConfig,
};
