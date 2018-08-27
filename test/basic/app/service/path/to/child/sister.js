const { Service } = require('../../../../../../..');

class SisterService extends Service {
    async find(username) {
        return {
            path: 'path/to/child/sister'
        };
    }
}
module.exports = SisterService;
