import * as fs from 'fs';
import * as path from 'path';

import { Booter } from '../lib/core/bootstrap';

const cwd = process.cwd();

export = (appInfo: Booter) => {
    return {
        /**
         * sin logbook日志保存目录路径
         */
        logbook: {
            /**
             * sin logbook日志保存目录路径
             */
            path: path.join(cwd, 'log'),
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
         *
         * @member Config#bodyParser
         * @property {Boolean} enable - enable bodyParser or not, default is true
         * @property {String | RegExp | Function | Array} ignore - won't parse request body when url path hit ignore pattern, can not set `ignore` when `match` presented
         * @property {String | RegExp | Function | Array} match - will parse request body only when url path hit match pattern
         * @property {String} encoding - body's encoding type，default is utf8
         * @property {String} formLimit - limit of the urlencoded body. If the body ends up being larger than this limit, a 413 error code is returned. Default is 100kb
         * @property {String} jsonLimit - limit of the json body, default is 100kb
         * @property {Boolean} strict - when set to true, JSON parser will only accept arrays and objects. Default is true
         * @property {Number} queryString.arrayLimit - urlencoded body array's max length, default is 100
         * @property {Number} queryString.depth - urlencoded body object's max depth, default is 5
         * @property {Number} queryString.parameterLimit - urlencoded body maximum parameters, default is 1000
         */
        bodyParser: {
            enable: true,
            encoding: 'utf8',
            formLimit: '100kb',
            jsonLimit: '100kb',
            strict: true,
            queryString: {
                arrayLimit: 100,
                depth: 5,
                parameterLimit: 1000,
            },
        },
    };
};
