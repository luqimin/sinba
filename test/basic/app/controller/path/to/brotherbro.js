const { Controller } = require('../../../../../..');

class BrotherController extends Controller {
    async second() {
        const { ctx } = this;

        ctx.body = 'path/to/brotherbro';
    }
}

module.exports = BrotherController;
