const { Controller } = require('../../../../../../..');

class SisterController extends Controller {
    async third() {
        const { ctx } = this;

        ctx.body = 'path/to/child/sister';
    }
}

module.exports = SisterController;
