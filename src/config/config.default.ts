import * as path from 'path';

import { Booter } from '../lib/core/bootstrap';

export = (appInfo: Booter) => {
    return {
        /**
         * sin logbook日志保存目录路径
         */
        logbook: {
            /**
             * sin logbook日志保存目录路径
             */
            path: path.join(appInfo.options.baseDir, 'log'),
            /**
             * sin logbook日志是否按日期分片
             */
            dateSplit: false,
            /**
             * logrotate, 按日期备份
             */
            logrotate: false,
        },

        /**
         * sinba内置中间件
         */
        coreMiddleware: ['siteFile', 'notfound', 'bodyParser'],

        /**
         * The option of `siteFile` middleware
         *
         * You can map some files using this options, it will response immdiately when matching.
         *
         * @member {Object} Config#siteFile - key is path, and value is url or buffer.
         * @example '/favicon.ico': fs.readFileSync(path.join(appInfo.options.baseDir, 'favicon.png'))
         */
        siteFile: {
            '/favicon.ico': '',
        },

        /**
         *  `notfound` middleware
         *
         * It will return page or json depend on negotiation when 404,
         * If pageUrl is set, it will redirect to the page.
         *
         * @member Config#notfound
         * @property {String} pageUrl - the 404 page url
         */
        notfound: {
            pageUrl: '',
        },

        /**
         * The option of `bodyParser` middleware
         * https://www.npmjs.com/package/koa-body
         */
        bodyParser: {
            enable: true,
            encoding: 'utf8',
            formLimit: '100kb',
            textLimit: '100kb',
            jsonLimit: '1mb',
            jsonStrict: true,
            strict: false,
        },

        /**
         * The option of `session` middleware
         * https://github.com/koajs/session
         */
        session: {
            key: '_sinba_sess',
            maxAge: 'session',
            autoCommit: true,
            overwrite: true,
            httpOnly: true,
            signed: true,
            rolling: false,
            renew: false,
        },
    };
};
