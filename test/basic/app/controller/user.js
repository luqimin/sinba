const {
    Controller
} = require('../../../..');

class UserController extends Controller {
    async render() {
        const {
            ctx,
        } = this;

        ctx.body = `hello world; user!`;
    }

    async ejs(){
        const {
            ctx,
        } = this;

        ctx.render('home', {test: `测试ejs${ctx.params.name}`});
    }

    async getUserInfo() {
        const {
            ctx,
        } = this;

        ctx.body = await this.service.user.find(ctx.params.name);
    }

    async middlerware1() {
        const {
            ctx,
        } = this;
    }

    async middlerware2() {
        const {
            ctx,
        } = this;
        ctx.body = ctx.body;
    }
}

module.exports = UserController;