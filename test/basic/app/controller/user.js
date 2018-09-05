const { Controller } = require('../../../..');

class UserController extends Controller {
    async render() {
        const { ctx } = this;

        ctx.body = `hello world; user!`;
    }

    async ejs() {
        const { ctx } = this;

        ctx.render('home', { test: `测试ejs${ctx.params.name}` });
    }

    async getUserInfo() {
        const { ctx } = this;

        ctx.body = await this.service.user.find(ctx.params.name);
    }

    async middlerware1() {
        const { ctx } = this;
    }

    async middlerware2() {
        const { ctx } = this;
        ctx.body = ctx.body;
    }

    async session() {
        const { ctx } = this;

        let n = ctx.session.views || 0;
        ctx.session.views = ++n;
        ctx.body = n + ' views';
    }

    async removeSession() {
        const { ctx } = this;
        ctx.session = null;
        ctx.body = 'session removed';
    }

    async getApp() {
        const { ctx, app } = this;
        ctx.body = { a: app.test, b: app.testInMiddleware };
    }

    async username() {
        const { ctx } = this;
        ctx.body = ctx.headers['text_name'];
    }

    async usernameFromService() {
        const { ctx } = this;
        const text_name = await this.service.user.headerUsername();
        ctx.body = text_name;
    }

    async manyServices() {
        const { ctx } = this;

        const find1 = await this.service.test.find1();
        const find2 = await this.service.test.find2();
        const find3 = await this.service.test.find3();

        ctx.body = { find1, find2, find3 };
    }
}

module.exports = UserController;
