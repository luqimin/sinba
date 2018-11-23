import * as path from 'path';

export interface SinbaOptions {
    /**
     * sin运行端口
     */
    port: number;
    /**
     * sin运行目录
     */
    baseDir: string;
    /**
     * sin package.json内容
     */
    sin?: { [key: string]: any };
    /**
     * Sinba运行路径
     */
    sinbaRoot: string;
}

/**
 * sinba core参数  new Sinba(coreConfig)
 */
const cwd = process.env.IME_SERVER_PATH || process.cwd();
const coreConfig = {
    port: 3000,
    baseDir: cwd,
    sinbaRoot: path.join(__dirname, '../../'),
};

export {
    coreConfig,
};
