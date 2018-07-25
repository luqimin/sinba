/**
 * logbook Profiler
 */

import * as moment from 'moment';

export const logbook = (str: string): string => {
    if (process.env.NODE_APP_INSTANCE) {
        // pm2启动实例，日志带上pm2实例id
        return `[${moment().format('YYYY-MM-DD HH:mm:ss:SSS ZZ')} | pm2_${process.env.NODE_APP_INSTANCE}] ${str}`;
    }
    return `[${moment().format('YYYY-MM-DD HH:mm:ss:SSS ZZ')}] ${str}`;
};
