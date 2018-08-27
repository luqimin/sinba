const { Controller } = require('../../../../..');

class KidController extends Controller {
    async multiService() {
        const { ctx } = this;

        const kid = await this.service.path.kid.find();
        const brother = await this.service.path.to.brother.find();
        const sister = await this.service.path.to.child.sister.find();

        ctx.body = {
            kid: kid.path,
            brother: brother.path,
            sister: sister.path,
        };
    }
}

module.exports = KidController;
