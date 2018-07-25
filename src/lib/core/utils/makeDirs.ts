import * as fs from 'fs';
import * as path from 'path';

// 递归创建目录
export const makeDirs = (dirname: string) => {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (makeDirs(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
};
