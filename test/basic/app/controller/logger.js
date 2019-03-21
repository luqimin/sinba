/**
 * 日志测试
 */
const { Controller } = require('../../../..');

class UserController extends Controller {
    async render() {
        const { ctx, app } = this;

        app.logger.debug('debug');
        app.logger.error('error');
        app.logger.name('sinbaDemo:name').debug('sinbaDemo:debug');
        app.logger.name('sinba').logbook('测试logbook');

        ctx.body = `hello world; logger!`;
    }

    async logbook() {
        const { ctx, app } = this;

        app.logger.name('sinlogbook').logbook('sinbaDemo:logbook');
        app.logger.logbook('测试logbook');

        ctx.body = `hello world; logger.logbook!`;
    }
}

module.exports = UserController;
