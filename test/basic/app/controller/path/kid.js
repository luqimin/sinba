const { Controller } = require('../../../../..');

class KidController extends Controller {
    async first() {
        const { ctx } = this;

        ctx.body = 'path/kid';
    }
}

module.exports = KidController;
