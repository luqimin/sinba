const { Controller } = require('../../../../../../..');

class SisterController extends Controller {
    async third() {
        const { ctx } = this;

        ctx.body = 'path/to/child/sisterbro';
    }
}

module.exports = SisterController;
