const { Controller } = require('../../../../..');

class KidController extends Controller {
    async first() {
        const { ctx } = this;

        ctx.body = 'path/kidbro';
    }
}

module.exports = KidController;
