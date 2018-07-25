/**
 * 初始化页面渲染引擎 ejs
 * app/view/*.ejs
 */

import * as path from 'path';
import * as fs from 'fs';
import { render } from 'ejs';

import { SinbaContext } from '../../base/sinba';

import { Booter } from '../index';
import { readFile } from '../../utils';
import { viewStore } from '../viewStore';

const initView = function (this: Booter) {
    try {
        const viewDir: string = path.join(this.options.baseDir, 'app/view');

        if (!fs.existsSync(viewDir)) {
            return;
        }

        const views: string[] = fs.readdirSync(viewDir);

        for (const viewFilename of views) {
            const viewName: string = path.basename(viewFilename, '.ejs');
            const viewFilepath: string = path.join(viewDir, viewFilename);
            const viewTemplate: string = readFile(viewFilepath);
            // 存储模板缓存
            viewStore.add(viewName, viewTemplate);
        }

        // 扩展ctx
        this.app.context.render = async function (name: string, data: { [key: string]: any }) {
            const ctx: SinbaContext = this;
            const tpl = viewStore.get(name);
            const html = render(tpl, data);

            ctx.app.logger.log(`render: ${name}`);
            ctx.type = 'html';
            ctx.body = html;

        };
    } catch (error) {
        throw error;
    }
};

export {
    initView,
};
